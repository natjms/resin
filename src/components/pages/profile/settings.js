import React, { useState, useEffect } from "react";

import {
    ScrollView,
    SafeAreaView,
    View,
    TextInput,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import mime from "mime";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as requests from "src/requests";
import Icon from "src/components/icons.js";

import * as ImagePicker from 'expo-image-picker';

import { withoutHTML } from "src/interface/rendering";

const Settings = (props) => {
    const [state, setState] = useState({
        loaded: false,
    });

    const _handleLogout = async () => {
        await requests.postForm(
            `https://${state.instance}/oauth/revoke`,
            {
                client_id: state.appObject.client_id,
                client_secret: state.appObject.client_secret,
                token: state.accessToken,
            }
        );

        await AsyncStorage.multiRemove([
                "@user_profile",
                "@user_instance",
                "@user_token",
        ]);

        props.navigation.navigate("Authenticate");
    };

    useEffect(() => {
        AsyncStorage
            .multiGet([
                "@user_profile",
                "@user_instance",
                "@user_token",
                "@app_object",
            ])
            .then(([profilePair, instancePair, tokenPair, appPair]) =>
                [
                    JSON.parse(profilePair[1]),
                    instancePair[1],
                    JSON.parse(tokenPair[1]),
                    JSON.parse(appPair[1]),
                ]
            )
            .then(([profile, instance, token, appObject]) => {
                let newProfile = profile;
                newProfile.fields = newProfile.fields == null
                    ? []
                    : newProfile.fields;

                setState({...state,
                    profile: profile,
                    instance: instance,
                    appObject: appObject,
                    accessToken: token.access_token,

                    // Malleable props that will actually go towards updating
                    // the profile credentials
                    locked: profile.locked,
                    newAvatar: {
                        uri: profile.avatar,
                    },
                    display_name: profile.display_name,
                    note: profile.note,

                    loaded: true,
                })
            });
    }, []);

    const _handleChangeProfilePhoto = async () => {
        await ImagePicker.requestMediaLibraryPermissionsAsync()

        const { uri } = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
        });

        const name = uri.split("/").slice(-1)[0];

        setState({...state,
            newAvatar: {
                uri,
                type: mime.getType(uri),
                name,
            },
        });
    };

    const _handleSaveProfile = async () => {
        let params = {
            display_name: state.display_name,
            note: state.note,
            locked: state.locked,
        };

        // In other words, if a picture has been selected...
        if (state.newAvatar.name) {
            params.avatar = state.newAvatar;
        }

        const newProfile = await fetch(
            `https://${state.instance}/api/v1/accounts/update_credentials`,
            {
                method: "PATCH",
                body: requests.objectToForm(params),
                headers: { "Authorization": `Bearer ${state.accessToken}`, }
            }
        ).then(resp => resp.json());

        await AsyncStorage.setItem("@user_profile", JSON.stringify(newProfile));

        props.navigation.navigate("Profile");
    };

    return (
        <>
            { state.loaded
                ? <ScrollView>
                    <View style = { styles.avatar.container }>
                        <Image
                            source = { { uri: state.newAvatar.uri } }
                            style = { styles.avatar.image }/>
                        <TouchableOpacity onPress = { _handleChangeProfilePhoto }>
                            <Text style = { styles.avatar.change }>
                                Change profile photo
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style = { styles.input.container }>
                        <Text style = { styles.label }>Display name</Text>
                        <TextInput
                            style = { styles.bar }
                            placeholder = { "Display name" }
                            value = { state.display_name }
                            onChangeText = {
                                (value) => {
                                    setState({...state,
                                        display_name: value,
                                    });
                                }
                            }/>

                        <Text style = { styles.label }>Bio</Text>
                        <TextInput
                            style = {
                                [
                                    styles.bar,
                                    { height: 100 },
                                ]
                            }
                            multiline = { true }
                            placeholder = { "Bio" }
                            // HACK: Using withoutHTML here is dangerous
                            value = { withoutHTML(state.note) }
                            onChangeText = {
                                (value) => {
                                    setState({...state,
                                        note: value
                                    });
                                }
                            }/>

                        <TouchableOpacity
                              onPress = {
                                () => (
                                    setState({...state,
                                        locked: !state.locked
                                    })
                                )
                              }>
                            <View style = { styles.check.container }>
                                <>
                                    { !state.locked
                                        ? <Icon name="square" size={24}/>
                                        : <Icon name="checkbox" size={24}/>
                                    }
                                </>
                                <Text style = { styles.check.label }>
                                    Manually approve follow requests?
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                              onPress = { _handleSaveProfile }
                              style = { styles.button.container }>
                            <Text style = { styles.button.text }> Save Profile </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                              style = { styles.button.container }
                              onPress = { _handleLogout }>
                            <Text style = {
                                    [ styles.button.text, styles.button.warning ]
                                  }>
                                Log out
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                : <></>
            }
        </>
    );
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const styles = {
    label: {
        paddingTop: 10,
        fontWeight: "bold",
        color: "#888",
    },
    bar: {
        borderBottomWidth: 1,
        borderBottomColor: "#888",
        padding: 10,
    },
    avatar: {
        container: {
            paddingTop: 10,
            paddingBottom: 10,
            flex: 1,
            alignItems: "center",
        },
        image: {
            width: SCREEN_WIDTH / 5,
            height: SCREEN_WIDTH / 5,
            borderRadius: SCREEN_WIDTH / 10,
            marginBottom: 10,
        },
        change: {
            fontSize: 18,
            color: "#888",
        },
    },
    input: {
        container: {
            padding: 10,
        },
    },
    check: {
        container: {
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
        },
        label: {
            paddingLeft: 10,
        },
    },
    button: {
        container: {
            width: SCREEN_WIDTH / 1.2,
            padding: 15,
            marginTop: 10,
            marginBottom: 5,
            marginLeft: "auto",
            marginRight: "auto",
            borderWidth: 1,
            borderColor: "#888",
            borderRadius: 5,
        },
        text: { textAlign: "center" },
        warning: {
            fontWeight: "bold",
            textDecorationLine: "underline",
        },
    },
};

export default Settings;
