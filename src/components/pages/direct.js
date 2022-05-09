import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    TextInput,
    Dimensions,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as requests from "src/requests";

import { Ionicons } from "@expo/vector-icons";

import ModerateMenu from "src/components/moderate-menu.js";

const TEST_IMAGE_1 = "https://cache.desktopnexus.com/thumbseg/2255/2255124-bigthumbnail.jpg";
const TEST_IMAGE_2 = "https://natureproducts.net/Forest_Products/Cutflowers/Musella_cut.jpg";
const TEST_ACCOUNT_1 = { id: 1, acct: "njms", display_name: "Nat🔆", avatar: TEST_IMAGE_1 };
const TEST_ACCOUNT_2 = { id: 2, acct: "someone", display_name: "Some person", avatar: TEST_IMAGE_2 };

const TEST_STATUS = {
    id: 1,
    account: TEST_ACCOUNT_1,
    content: "This is a direct message",
};

function filterConversations(convs, query) {
    return convs.filter(conv => {
        const accts = conv.accounts.map(account => account.acct).join();
        const names = conv.accounts.map(account => account.display_name).join();

        return accts.includes(query) || names.includes(query)
    });
}

const Direct = ({ navigation }) => {
    const FETCH_LIMIT = 1;

    const [state, setState] = useState({
        loaded: false,
        query: "",
        fetchOffset: 0,
    });

    useEffect(() => {
        let instance, accessToken;
        AsyncStorage
            .multiGet([
                "@user_instance",
                "@user_token",
            ])
            .then(([instancePair, tokenPair]) => {
                instance = instancePair[1];
                accessToken = JSON.parse(tokenPair[1]).access_token;

                return requests.fetchConversations(
                    instance,
                    accessToken,
                    { limit: FETCH_LIMIT, }
                );
            })
            .then(conversations => {
                setState({...state,
                    loaded: true,
                    conversations,
                    fetchOffset: FETCH_LIMIT,
                    instance,
                    accessToken,
                });
            });
    }, []);

    const _handleShowMore = async () => {
        const results = await requests.fetchConversations(
            state.instance,
            state.accessToken,
            {
                max_id: state.conversations[state.conversations.length - 1],
                limit: FETCH_LIMIT,
            }
        );

        setState({...state,
            conversations: state.conversations.concat(results),
            fetchOffset: state.fetchOffset + FETCH_LIMIT,
        });
    };

    const onPressConversationFactory = (conv) => {
        return () => {
            navigation.navigate("Conversation", {
                conversation: conv,
            });
        }
    };

    const renderConversation = (item) => {
        const boldIfUnread = item.unread ? styles.bold : {};

        return (
            <View
                  style = { [styles.row, styles.conv.container] }
                  key = { item.id }>
                <TouchableOpacity
                      style = { [styles.row, styles.conv.containerButton] }
                      onPress = {
                        onPressConversationFactory(item)
                      }>
                    <View style = { styles.conv.avatar.container }>
                        <Image
                            source = { { uri: item.accounts[0].avatar } }
                            style = { styles.conv.avatar.image }/>
                    </View>
                    <View style = { styles.conv.body }>
                        <Text style = { boldIfUnread }>
                            { item.accounts.map(account => account.acct).join(", ") }
                        </Text>
                        <Text style = { boldIfUnread }>
                            {
                                // Prefix message with acct
                                [
                                    item.accounts.length > 1 ?
                                        item.last_status.account.acct + ": "
                                        : "",
                                    item.last_status.content,
                                ].join("")
                            }
                        </Text>
                    </View>
                </TouchableOpacity>
                <View style = { styles.conv.context }>
                    <ModerateMenu
                        triggerStyle = { styles.menu.trigger } />
                </View>
            </View>
        );
    };

    return (
        <>
            { state.loaded
                ? <>
                    <View style = { [ styles.row, styles.form.container ] }>
                        <TextInput
                            placeholder = "Search..."
                            value = { state.query }
                            style = { styles.form.searchBar }
                            onChangeText = {
                                (value) => {
                                    setState({...state,
                                        query: value,
                                    });
                                }
                            }/>
                        <TouchableOpacity
                              style = { styles.form.compose }
                              onPress = { () => { navigation.navigate("Compose") } }>
                            <Ionicons name = "md-create" size = { 24 } color = "black"/>
                        </TouchableOpacity>
                    </View>
                    <>
                        {
                            filterConversations(
                                state.conversations,
                                state.query
                            ).map(renderConversation)
                        }
                    </>
                    <>
                        { state.conversations.length == state.fetchOffset
                            ? <View style = { styles.showMore.container }>
                                <TouchableOpacity
                                        onPress = { props.onShowMore }>
                                    <View style = { styles.showMore.button }>
                                        <Text>Show more?</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            : <></>
                        }
                    </>
                </>
                : <></>
            }
        </>
    );
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const styles = {
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    form: {
        container: {
            marginLeft: 20,
            marginTop: 20,
            marginBottom: 20,
        },
        searchBar: {
            padding: 10,
            width: SCREEN_WIDTH * 3 / 4,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: "#888",
        },
        compose: {
            marginLeft: "auto",
            marginRight: "auto",
        },
    },
    conv: {
        container: {
            paddingBottom: 20,
            paddingLeft: 10,
            paddingRight: 20,
        },
        containerButton: { flexGrow: 1 },
        avatar: {
            image: {
                width: 40,
                height: 40,
                borderRadius: 20,
            }
        },
        body: {
            marginLeft: 10,
        },
        context: {
            marginLeft: "auto",
        }
    },
    menu: {
        trigger: {
            width: 20,
            height: 20,
        },
    },
    showMore: {
        container: {
            justifyContent: "center",
            alignItems: "center"
        },
        button: {
            borderWidth: 1,
            borderColor: "#888",
            borderRadius: 5,
            padding: 10,
            margin: 20
        },
    },
    bold: { fontWeight: "bold" },
};

export { Direct as default };
