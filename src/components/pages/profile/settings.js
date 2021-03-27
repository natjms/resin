import React, { useState, useEffect } from "react";

import {
    SafeAreaView,
    View,
    TextInput,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
} from "react-native";

import { withoutHTML } from "src/interface/rendering";

import { ScreenWithBackBarJsx } from "src/components/navigation/navigators";

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

const SettingsJsx = (props) => {
    const [state, setState] = useState({
        // Use Context to get this stuff eventually
        profile: TEST_PROFILE,
        newProfile: TEST_PROFILE,
    });

    useEffect(() => { console.log(state) });

    const fields = state.newProfile.fields;

    return (
        <ScreenWithBackBarJsx navigation = { props.navigation }>
            <View style = { styles.avatar.container }>
                <Image
                    source = { { uri: state.profile.avatar } }
                    style = { styles.avatar.image }/>
                <TouchableOpacity>
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
                    value = { state.newProfile.display_name }
                    onChangeText = {
                        (value) => {
                            setState({...state,
                                newProfile: {...state.newProfile, display_name: value}
                            });
                        }
                    }/>

                <Text style = { styles.label }>User name</Text>
                <TextInput
                    style = { styles.bar }
                    placeholder = { "User name" }
                    value = { state.newProfile.username }
                    onChangeText = {
                        (value) => {
                            setState({...state,
                                newProfile: {...state.newProfile, username: value}
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
                    value = { withoutHTML(state.newProfile.note) }
                    onChangeText = {
                        (value) => {
                            setState({...state,
                                newProfile: {...state.newProfile, note: value}
                            });
                        }
                    }/>
                {
                    fields.map((field, i) =>
                        <View
                              style = { styles.fields.container }
                              key = { i }>
                            <TouchableOpacity
                                  onPress = {
                                    () => {
                                        let newFields;
                                        if (fields.length == 1) {
                                            newFields = [{ name: "", value: "" }];
                                        } else {
                                            newFields = state.newProfile.fields;
                                            newFields.splice(i, 1);
                                        }

                                        setState({...state,
                                            newProfile: {...state.newProfile,
                                                fields: newFields,
                                            },
                                        });
                                    }
                                  }>
                                <Image
                                    style = {
                                        [
                                            styles.fields.cross,
                                            fields.length == 1
                                              && fields[0].name == ""
                                              && fields[0].value == ""
                                                ? { visibility: "hidden" }
                                                : {}
                                        ]
                                    }
                                    source = { require("assets/eva-icons/close.png") }/>
                            </TouchableOpacity>
                            <View style = { styles.fields.subContainer }>
                                <Text style = { styles.label }>Name</Text>
                                <TextInput
                                    style = { [styles.bar, styles.fields.cell] }
                                    placeholder = { "Name" }
                                    value = { withoutHTML(fields[i].name) }
                                    onChangeText = {
                                        (text) => {
                                            let newFields = fields;
                                            newFields[i] = {...newFields[i],
                                                name: text,
                                            };

                                            setState({...state,
                                                newProfile: {...state.newProfile,
                                                    fields: newFields,
                                                },
                                            });
                                        }
                                    } />
                            </View>
                            <View style = { styles.fields.subContainer }>
                                <Text style = { styles.label }>Value</Text>
                                <TextInput
                                    style = { [styles.bar, styles.fields.cell] }
                                    placeholder = { "Value" }
                                    value = { withoutHTML(fields[i].value) }
                                    onChangeText = {
                                        (text) => {
                                            let newFields = fields;
                                            newFields[i] = {...newFields[i],
                                                value: text,
                                            };

                                            setState({...state,
                                                newProfile: {...state.newProfile,
                                                    fields: newFields,
                                                },
                                            });
                                        }
                                    } />
                            </View>
                        </View>
                    )
                }
                <TouchableOpacity
                      onPress = {
                        () => {
                            setState({...state,
                                newProfile: {...state.newProfile,
                                    fields: state.newProfile.fields.concat({ name: "", value: ""}),
                                },
                            });
                        }
                      }>
                    <Image
                        style = { styles.fields.plus }
                        source = { require("assets/eva-icons/plus.png") } />
                </TouchableOpacity>
                <TouchableOpacity style = { styles.largeButton }>
                    <Text> Save Profile </Text>
                </TouchableOpacity>
                <TouchableOpacity style = { styles.largeButton }>
                    <Text style = { styles.textWarning }> Log out </Text>
                </TouchableOpacity>
            </View>
        </ScreenWithBackBarJsx>
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
    fields: {
        container: {
            flex: 1,
            flexDirection: "row",
            alignItems: "flex-end",
        },
        cross: {
            width: 30,
            height: 30,
            marginRight: 10,
            marginBottom: 10,
        },
        plus: {
            width: 30,
            height: 30,
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: 10,
        },
        subContainer: {
            flexGrow: 0.5,
        },
        cell: {
            width: SCREEN_WIDTH / 2.5,
        },
    },
    largeButton: {
        width: SCREEN_WIDTH / 1.2,
        padding: 15,
        marginTop: 10,
        marginBottom: 5,
        marginLeft: "auto",
        marginRight: "auto",
        borderWidth: 1,
        borderColor: "#888",
        borderRadius: 5,
        textAlign: "center",
    },
    textWarning: {
        fontWeight: "bold",
        textDecorationLine: "underline",
    },
};

export default SettingsJsx;
