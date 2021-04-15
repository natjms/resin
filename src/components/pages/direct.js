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

import { Ionicons } from "@expo/vector-icons";

import { ScreenWithTrayJsx } from "src/components/navigation/navigators";
import ModerateMenuJsx from "src/components/moderate-menu.js";

const TEST_IMAGE_1 = "https://cache.desktopnexus.com/thumbseg/2255/2255124-bigthumbnail.jpg";
const TEST_IMAGE_2 = "https://natureproducts.net/Forest_Products/Cutflowers/Musella_cut.jpg";
const TEST_ACCOUNT_1 = { acct: "njms", display_name: "Nat🔆", avatar: TEST_IMAGE_1 };
const TEST_ACCOUNT_2 = { acct: "someone", display_name: "Some person", avatar: TEST_IMAGE_2 };

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

const DirectJsx = ({ navigation }) => {
    const [state, setState] = useState({
        loaded: false,
        query: ""
    });

    useEffect(() => {
        setState({...state,
            loaded: true,
            conversations: [
                {
                    id: 1,
                    unread: true,
                    accounts: [TEST_ACCOUNT_1],
                    last_status: TEST_STATUS,
                },
                {
                    id: 2,
                    unread: false,
                    accounts: [TEST_ACCOUNT_1, TEST_ACCOUNT_2],
                    last_status: TEST_STATUS,
                }
            ],
        });
    }, []);

    const onPressConversationFactory = (conv) => {
        return () => {
            navigation.navigate("Conversation", {
                conversation: conv,
            });
        }
    };

    const renderConversation = ({ item }) => {
        const boldIfUnread = item.unread ? styles.bold : {};

        return <View style = { [styles.row, styles.conv.container] }>
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
                <ModerateMenuJsx
                    triggerStyle = { styles.menu.trigger } />
            </View>
        </View>
    };

    return (
        <ScreenWithTrayJsx
              navigation = { navigation }
              originTab = "Direct">
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
            { state.loaded ?
                <FlatList
                    data = { filterConversations(state.conversations, state.query) }
                    renderItem = { renderConversation }
                    keyExtractor = { conv => conv.id }/>
                : <></>
            }
        </ScreenWithTrayJsx>
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
    bold: { fontWeight: "bold" },
};

export { DirectJsx as default };
