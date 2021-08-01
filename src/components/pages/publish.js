import React, { useState, useEffect } from "react";
import {
    Dimensions,
    View,
    Image,
    Text,
    TextInput,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

import { getAutoHeight } from "src/interface/rendering";
import { ScreenWithTrayJsx } from "src/components/navigation/navigators";
import { TouchableOpacity } from "react-native-gesture-handler";

import mime from "mime";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from "expo-permissions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as requests from "src/requests";

const PublishJsx = ({ navigation }) => {
    const [ state, setState ] = useState({
        loaded: false,
    });

    useEffect(() => {
        let instance, accessToken;

        AsyncStorage
            .multiGet([
                "@user_instance",
                "@user_token",
            ])
            .then(([ instancePair, tokenPair ]) => {
                instance = instancePair[1];
                accessToken = JSON.parse(tokenPair[1]).access_token;

                return ImagePicker.requestMediaLibraryPermissionsAsync();
            })
            .then(permissionResult => {
                console.warn(permissionResult);
                if (permissionResult.granted) {
                    return ImagePicker.launchImageLibraryAsync({
                        allowsEditing: true,
                    });
                } else {
                    throw "Permission not granted";
                }
            })
            .then((imageData) => {
                if (!imageData.cancelled) {
                    return imageData;
                } else {
                    throw "Image picker closed";
                }
            })
            .then(({ uri, type, width, height }) => {
                const name = uri.split("/").slice(-1)[0];

                setState({...state,
                    loaded: true,
                    instance,
                    accessToken,
                    visibility: "public",
                    image: {
                        data: {
                            uri,
                            type: mime.getType(uri),
                            name,
                        },
                        width: SCREEN_WIDTH,
                        height: getAutoHeight(width, height, SCREEN_WIDTH),
                    },
                });
            })
            .catch(e => {
                console.warn(e);
                navigation.goBack();
            });
    }, []);

    const _handlePublish = async () => {
        const mediaAttachment = await requests.publishMediaAttachment(
            state.instance,
            state.accessToken,
            { file: state.image.data }
        );

        console.warn(mediaAttachment);
        if(mediaAttachment.type == "unknown") return;

        const params = {
            status: state.caption,
            "media_ids[]": mediaAttachment.id,
            visibility: state.visibility,
        };

        const newStatus = await requests.publishStatus(
            state.instance,
            state.accessToken,
            params
        );

        console.warn(newStatus);
        navigation.navigate("Feed");
    };

    const Selector = (props) => {
        const color = props.active == props.visibility ? "black" : "#888";

        return (
            <TouchableOpacity
                  style = { styles.form.option.button }
                  onPress = {
                      () => setState({ ...state, visibility: props.visibility })
                  }>
                <View style = { styles.form.option.inner }>
                    <Ionicons
                        name = { props.icon }
                        color = { color }
                        size={24} />
                    <Text style = { { color } }>
                        &nbsp;
                        { props.message }
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <>
            { state.loaded
                ? <ScreenWithTrayJsx
                      active = "Publish"
                      navigation = { navigation } >
                    <View style = { styles.preview.container }>
                        <Image
                            style = {[
                                styles.preview.image,
                                {
                                    width: state.image.width,
                                    height: state.image.height,
                                },
                            ]}
                            source = { { uri: state.image.data.uri } } />
                    </View>
                    <View style = { styles.form.container }>
                        <TextInput
                            placeholder = "Caption this post..."
                            value = { state.caption }
                            multiline
                            autoFocus
                            onChangeText = {
                                caption => setState({ ...state, caption })
                            }
                            style = { [ styles.form.input, { height: 100, } ] } />

                        <Text style = { styles.form.label }>Visibility</Text>
                        <Selector
                            visibility = "public"
                            active = { state.visibility }
                            icon = "globe-outline"
                            message = "Anyone can see this post" />
                        <Selector
                            visibility = "unlisted"
                            active = { state.visibility }
                            icon = "lock-open-outline"
                            message = "Keep this post off public timelines" />
                        <Selector
                            visibility = "private"
                            active = { state.visibility }
                            icon = "lock-closed-outline"
                            message = "Only share this with my followers" />

                        <TouchableOpacity
                              onPress = { _handlePublish }
                              style = { styles.form.button.container }>
                            <Text style = { styles.form.button.label }>
                                Publish
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScreenWithTrayJsx>
                : <></>
            }
        </>
    );
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const styles = {
    preview: {
        container: {
            paddingTop: 10,
        },
        image: {
            marginLeft: "auto",
            marginRight: "auto",
            height: SCREEN_HEIGHT / 3,
        },
    },

    form: {
        container: {
            padding: 10,
        },
        input: {
            borderBottomWidth: 1,
            borderBottomColor: "#888",
            textAlignVertical: "top",
            padding: 10,
        },
        label: {
            marginTop: 20,
            fontSize: 15,
            color: "#666",
        },
        option: {
            button: {},
            inner: {
                marginTop: 10,
                flexDirection: "row",
                alignItems: "center",
            },
        },
        button: {
            container: {
                width: SCREEN_WIDTH * (3/4),
                marginTop: 30,
                marginLeft: "auto",
                marginRight: "auto",
                padding: 20,
                borderWidth: 1,
                borderColor: "#666",
                borderRadius: 10,
            },
            label: {
                textAlign: "center",
            },
        },
    },
};

export { PublishJsx as default };
