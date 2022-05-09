import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    View,
    TextInput,
    TouchableOpacity,
    Text,
    Image,
    Dimensions,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";

import * as requests from "src/requests";

const Authenticate = ({navigation}) => {
    const REDIRECT_URI = Linking.makeUrl("authenticate");
    const [state, setState] = useState({
        instance: "",
        renderLogin: false,
    });

    const init = async () => {
        const [instancePair, tokenJSONPair, profileJSONPair, appJSONPair] =
            await AsyncStorage.multiGet([
                "@user_instance",
                "@user_token",
                "@user_profile",
            ]);

        const instance = instancePair[1];
        const tokenJSON = tokenJSONPair[1];
        const profileJSON = profileJSONPair[1];

        if (profileJSON == null) {
            // The user hasn't logged in yet.
            setState({ ...state, renderLogin: true, });
            return;
        }

        const accessToken = JSON.parse(tokenJSON).access_token;

        // Check to see if the credentials are still valid
        const verifiedUser = await requests.verifyCredentials(
            instance,
            accessToken
        ).catch(e => {
            /* The Pixelfed API returns an HTML page when your access token gets
             * revoked instead of the JSON error object. Since this causes a lot
             * of problems, we're going to assume that if the response is HTML,
             * then the user needs to log in again. See issue #27.
             */
            if (e instanceof SyntaxError) {
                // Generate faux error API response
                return { "error": true };
            }
        });

        if(verifiedUser.error) {
            // `error` will be undefined if the token is valid
            // Purge the user's data
            await AsyncStorage.multiRemove([
                "@user_instance",
                "@user_token",
                "@user_profile",
            ]);

            setState({...state,
                renderLogin: true,
            });
            return;
        }

        // requests.verifyCredentials returns the latest version of the
        // profile on success, so take this opportunity to update it
        const newProfile = verifiedUser;
        await AsyncStorage.setItem(
            "@user_profile",
            JSON.stringify(newProfile)
        );

        // Since nothing went wrong, navigate to the feed.
        navigation.replace("Main");
    };

    const _handleUrl = async ({ url }) => {
        // When the app is foregrounded after authorizing the app from their
        // instance's website...
        if (Constants.platform.ios) {
            WebBrowser.dismissBrowser();
        } else {
            Linking.removeEventListener("url", _handleUrl)
        }

        const { path, queryParams } = Linking.parse(url);

        const instance = await AsyncStorage.getItem("@user_instance");
        const api = `https://${instance}`;
        const app = JSON.parse(
            await AsyncStorage.getItem("@app_object")
        );

        // Fetch the access token
        const tokenRequestBody = {
            client_id: app.client_id,
            client_secret: app.client_secret,
            redirect_uri: REDIRECT_URI,
            grant_type: "authorization_code",
            code: queryParams.code,
            scope: "read write follow push",
        };

        const token = await requests
            .postForm(`${api}/oauth/token`, tokenRequestBody)
            .then(resp => resp.json());

        // Store the token
        await AsyncStorage.setItem("@user_token", JSON.stringify(token));

        const profile = await requests.get(
            `${api}/api/v1/accounts/verify_credentials`,
            token.access_token
        ).then(resp => resp.json());

        await AsyncStorage.multiSet([
            [ "@user_profile", JSON.stringify(profile), ],
            [ // TODO: Enable storing notifications
                "@user_notifications",
                JSON.stringify({
                    unread: false,
                    memory: []
                }),
            ],
        ]);

        navigation.replace("Main");
    };

    useEffect(() => {
        // Register the listener for the app getting foregrounded
        // This is for when the user has navigated back from their web browser
        // having approved the app
        Linking.addEventListener("url", _handleUrl);

        // Start initialization sequence
        init();
    }, []);

    const _login = async () => {
        const url = `https://${state.instance}`;

        let appJSON = await AsyncStorage.getItem("@app_object");
        let app;

        // Ensure the app has been created
        if (appJSON == null) {
            // Register app: https://docs.joinmastodon.org/methods/apps/#create-an-application
            app = await requests.postForm(`${url}/api/v1/apps`, {
                client_name: "Resin",
                redirect_uris: REDIRECT_URI,
                scopes: "read write follow push",
                website: "https://github.com/natjms/resin",
            }).then(resp => resp.json());

            await AsyncStorage
                .setItem("@app_object", JSON.stringify(app))
        } else {
            // The app has already been registered
            app = JSON.parse(appJSON);
        }

        // Store the domain name of the instance for use in
        // the _handleUrl callback
        // NOTE: state.instance is not accessible from _handleUrl; this
        // probably has something to do with the fact that the app loses
        // focus when WebBrowser.openAuthSessionAsync gets called.
        await AsyncStorage.setItem("@user_instance", state.instance);

        // Get the user to authorize the app
        await WebBrowser.openAuthSessionAsync(
            `${url}/oauth/authorize`
                + `?client_id=${app.client_id}`
                + `&scope=read+write+follow+push`
                + `&redirect_uri=${REDIRECT_URI}`
                + `&response_type=code`
        );
    };

    return (
        <SafeAreaView style = { styles.container }>
            {
                state.renderLogin
                    ? <View style = { styles.innerContainer }>
                        <View style = { styles.logo.container }>
                            <Image
                                style = { styles.logo.image }
                                    resizeMode = { "contain" }
                                    source = { require("assets/logo/logo-standalone.png") }/>
                        </View>
                        <Text style = { styles.label }> Instance domain name </Text>
                        <TextInput
                            style = { styles.input }
                            placeholder = { "domain.tld" }
                            value = { state.instance }
                            onChangeText = {
                                value => setState({ ...state, instance: value })
                            }/>

                        <TouchableOpacity
                              style = { styles.login.button }
                              onPress = { _login }>
                            <Text style = { styles.login.label }> Login </Text>
                        </TouchableOpacity>
                    </View>
                    : <></>
            }
        </SafeAreaView>
    );
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const styles = {
    container: {
        justifyContent: "center",
        alignItems: "center",
        height: SCREEN_HEIGHT,
    },
    innerContainer: {
        width: SCREEN_WIDTH / 1.5,
    },
    logo: {
        container: {
            alignItems: "center",
            marginBottom: 30,
        },
        image: {
            width: 100,
            height: 100,
        }
    },
    label: {
        fontWeight: "bold",
        color: "#888",
    },
    input: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#888",
        marginBottom: 10,
    },
    login: {
        button: {
            borderWidth: 1,
            borderColor: "#888",
            borderRadius: 5,
            padding: 15,
        },
        label: {
            textAlign: "center",
        },
    },
};

export { Authenticate as default };
