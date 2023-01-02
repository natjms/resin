import React, { useState, useEffect } from "react";
import {
    View,
    SafeAreaView,
    Text,
    Image,
    TextInput,
    ScrollView,
    Dimensions,
    TouchableOpacity,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "src/components/icons.js";

import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers
} from "react-native-popup-menu";

const { SlideInMenu } = renderers;

import { timeToAge, StatusBarSpace } from "src/interface/rendering";

const TEST_IMAGE_1 = "https://cache.desktopnexus.com/thumbseg/2255/2255124-bigthumbnail.jpg";
const TEST_IMAGE_2 = "https://natureproducts.net/Forest_Products/Cutflowers/Musella_cut.jpg";
const TEST_ACCOUNT_1 = { id: 1, acct: "someone", display_name: "Someone", avatar: TEST_IMAGE_1 };
const TEST_ACCOUNT_2 = { id: 2, acct: "someone_else", display_name: "Another person", avatar: TEST_IMAGE_2 };

const TEST_STATUS = {
    account: TEST_ACCOUNT_1,
    content: "This is a direct message",
    created_at: 1596745156000,
};

const TEST_MESSAGES = [
    { ...TEST_STATUS, id: 1 },
    { ...TEST_STATUS, id: 2, account: TEST_ACCOUNT_2 },
    { ...TEST_STATUS, id: 3 },
    { ...TEST_STATUS, id: 4, account: { acct: "njms" } },
    { ...TEST_STATUS, id: 5 },
];

const ConversationContainer = (props) => (
    <SafeAreaView style = { { flex: 1 } }>
        <StatusBarSpace color = "white"/>
        <BackBar navigation = { props.navigation }>
            { props.renderBackBar() }
        </BackBar>
        <ScrollView>
            { props.children }
        </ScrollView>
        <View style = { [ styles.row, styles.send.container ] }>
            <TextInput
                placeholder = "Say something..."
                multiline
                value = { props.state.newMessage }
                style = { styles.input }
                onChangeText = {
                    value => {
                        props.setState({...props.state,
                            newMessage: value,
                        });
                    }
                }/>
            <TouchableOpacity
                  style = { styles.send.button }
                  onPress = { props.onSubmit }>
                <Icon name="paper-plane" size={24}/>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
);

const Compose = ({ navigation }) => {
    const [state, setState] = useState({
        accts: [],
        newMessage: "",
    });
    const renderBackBar = () => (
        <TextInput
            style = { styles.input }
            placeholder = "someone@example.tld, someone_else..."
            onChangeText = {
                (value) => {
                    setState({...state,
                        accts: value.split(",").map(acct => acct.trim())
                    });
                }
            }/>
    );

    return <ConversationContainer
        renderBackBar = { renderBackBar }
        navigation = { navigation }
        state = { state }
        setState = { setState }
        onSubmit = {
            () => {
                // Create the conversation, navigate to conversation.js
            }
        }/>;
};

const Conversation = ({ navigation }) => {
    const conversation = route.params.conversation
    const [state, setState] = useState({
        loaded: false,
        newMessage: "",
    });

    useEffect(() => {
        // Get the context of last_status, then profile from AsyncStorage
        AsyncStorage.getItem("@user_profile").then((profile) => {
            setState({...state,
                loaded: true,
                profile: JSON.parse(profile),
                messages: TEST_MESSAGES,
            });
        });
    }, []);

    const accountListOptionsStyles = {
        optionWrapper: { // The wrapper around a single option
            flexDirection: "row",
            alignItems: "center",

            paddingLeft: SCREEN_WIDTH / 15,
            paddingTop: SCREEN_WIDTH / 30,
            paddingBottom: SCREEN_WIDTH / 30
        },
        optionsWrapper: { // The wrapper around all options
            marginTop: SCREEN_WIDTH / 20,
            marginBottom: SCREEN_WIDTH / 20,
        },
        optionsContainer: { // The Animated.View
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10
        }
    };

    const renderBackBar = () => (
        <View style = { [ styles.row, styles.backBar.container ] }>
            <Menu renderer = { SlideInMenu }>
                <MenuTrigger>
                    <View style = { styles.row }>
                        <Image
                            source = { { uri: conversation.last_status.account.avatar } }
                            style = { styles.backBar.avatar } />
                        <Text style = { styles.bold }>
                            {
                                conversation.accounts
                                    .slice(0, 3) // Take first 3 accounts only
                                    .map(account => account.acct)
                                    .join(", ")
                            }
                        </Text>
                    </View>
                </MenuTrigger>
                <MenuOptions customStyles = { accountListOptionsStyles }>
                    {
                        conversation.accounts.map(account =>
                            <MenuOption key = { account.id }>
                                <Image
                                    source = { { uri: account.avatar } }
                                    style = { styles.backBar.accountList.avatar }/>
                                <View>
                                    <Text style = { styles.bold }>
                                        @{ account.acct }
                                    </Text>
                                    <Text>
                                        { account.display_name }
                                    </Text>
                                </View>
                            </MenuOption>
                        )
                    }
                </MenuOptions>
            </Menu>
        </View>
    );

    const renderMessage = (item) => {
        const yours = state.profile.acct == item.account.acct;
        return <View key = { item.id }>
            { !yours
                ? <Text style = { styles.message.acct }>
                    { item.account.acct }
                </Text>
                : <></>
            }
            <View style = { styles.message.container }>
                { !yours
                    ? <Image
                        source = { { uri: item.account.avatar } }
                        style = { styles.message.avatar }/>
                    : <></>
                }
                <View
                      style = {
                        [
                            yours
                                ? styles.message.yourBubble
                                : {},
                            styles.message.bubble,
                        ]
                      }>
                    <Text style = { yours ? styles.message.yourText : {} }>
                        <Text>
                            { item.content + "\n" }
                        </Text>
                        <Text style = { styles.message.age }>
                            { timeToAge(item.created_at) }
                        </Text>
                    </Text>
                </View>
            </View>
        </View>;
    };

    return (
        <ConversationContainer
              renderBackBar = { renderBackBar }
              navigation = { navigation }
              state = { state }
              setState = { setState }>
            { state.loaded
                ? state.messages.map(renderMessage)
                : <></>
            }
        </ConversationContainer>
    );
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const styles = {
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    backBar: {
        accountList: {
            avatar: {
                width: 40,
                height: 40,
                borderRadius: 20,
                marginRight: 10,
            },
        },
        container: {
            marginLeft: 20,
            paddingTop: 10,
            paddingBottom: 10,
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 10,
        },
    },
    message: {
        container: {
            paddingTop: 5,
            paddingBottom: 10,
            paddingLeft: 10,
            paddingRight: 10,
            flexDirection: "row",
        },
        acct: {
            paddingLeft: 60,
            fontSize: 12,
            color: "#888",
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 10,
        },
        bubble: {
            width: SCREEN_WIDTH * 3/4,
            borderWidth: 1,
            borderColor: "#888",
            borderRadius: 10,
            padding: 10,
        },
        yourBubble: {
            backgroundColor: "#CCC",
            marginLeft: "auto",
        },
        yourText: {
            //color: "white",
            textAlign: "right",
        },
        age: {
            fontSize: 10,
            color: "#888",
        },
    },
    send: {
        container: {
            marginTop: 10,
            marginBottom: 10,
            marginLeft: 10,
        },
        button: {
            marginLeft: 10,
            marginRight: 10,
        }
    },
    bold: { fontWeight: "bold", },
    input: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#888",
        borderRadius: 5,
        flexGrow: 1,
    },
};

export { Conversation as default, Compose, };
