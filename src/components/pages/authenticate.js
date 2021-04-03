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

const TEST_IMAGE = "https://cache.desktopnexus.com/thumbseg/2255/2255124-bigthumbnail.jpg";
const TEST_PROFILE = {
    username: "njms",
    acct: "njms",
    display_name: "Nat🔆",
    locked: false,
    bot: false,
    note: "Yeah heart emoji.",
    avatar: TEST_IMAGE,
    followers_count: "1 jillion",
    statuses_count: 334,
    fields: [
        {
            name: "Blog",
            value: "<a href=\"https://njms.ca\">https://njms.ca</a>",
            verified_at: "some time"
        },
        {
            name: "Github",
            value: "<a href=\"https://github.com/natjms\">https://github.com/natjms</a>",
            verified_at: null
        }
    ]
};

const AuthenticateJsx = ({navigation}) => {
    const [state, setState] = useState({
        acct: "",
        password: "",
        authChecked: false,
    });

    useEffect(() => {
        AsyncStorage.getItem("@user_profile").then((profile) => {
            if (profile) {
                navigation.navigate("Feed");
            }

            setState({...state, authChecked: true});
        });
    }, []);

    const loginCallback = async () => {
        const profileJSON = JSON.stringify(TEST_PROFILE);

        // TODO: Should fetch initial notifications to prevent bugging a newly
        // logged in user about the notifications already on their account
        const notificationsJSON = JSON.stringify({
            unread: false,
            memory: [{ id: 1 }, { id: 2 }],
        });
        await AsyncStorage.setItem("@user_profile", profileJSON);
        await AsyncStorage.setItem("@user_notifications", notificationsJSON);

        navigation.navigate("Feed");
    };

    return (
        <SafeAreaView style = { styles.container }>
            {
                state.authChecked
                    ? <View style = { styles.innerContainer }>
                        <View style = { styles.logo.container }>
                            <Image
                                style = { styles.logo.image }
                                    resizeMode = { "contain" }
                                    source = { require("assets/logo/logo-standalone.png") }/>
                        </View>
                        <Text style = { styles.label }> Account name </Text>
                        <TextInput
                            style = { styles.input }
                            placeholder = { "name@domain.tld" }
                            onChangeText = {
                                value => setState({ ...state, acct: value })
                            }/>

                        <Text style = { styles.label }> Password </Text>
                        <TextInput
                            style = { styles.input }
                            placeholder = { "************" }
                            secureTextEntry = { true }
                            onChangeText = {
                                value => setState({ ...state, password: value })
                            }/>
                        <TouchableOpacity
                              style = { styles.login.button }
                              onPress = { loginCallback }>
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

export { AuthenticateJsx as default };
