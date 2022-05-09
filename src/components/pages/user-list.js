import React from "react";
import {
    SafeAreaView,
    View,
    Image,
    Text,
    Dimensions,
    TouchableOpacity,
} from "react-native";

import ModerateMenu from "src/components/moderate-menu.js";

const UserList = ({navigation}) => {
    const data = navigation.getParam("data", [])
    const context = navigation.getParam("context", "");

    return (
        <>
            {
                context ?
                    <Text style = { styles.context }>
                        { context }:
                    </Text>
                    : <></>
            }
            {
                data.map(item =>
                    <View
                          key = { item.id }
                          style = { [ styles.flexContainer, styles.itemContainer ] }>
                        <TouchableOpacity
                          style = { styles.accountButton }
                          onPress = {
                            () => {
                                navigation.push("ViewProfile", { profile: item });
                            }
                          }>
                            <View style = { styles.flexContainer }>
                                <Image
                                    source = { { uri: item.avatar} }
                                    style = { styles.avatar } />
                                <View>
                                    <Text style = { styles.acct }>
                                        @{ item.acct }
                                    </Text>
                                    <Text style = { styles.displayName }>
                                        { item.display_name }
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <ModerateMenu
                            containerStyle = { styles.moderateMenu }
                            triggerStyle = { styles.ellipsis } />
                    </View>
                )
            }
        </>
    );
};

const SCREEN_WIDTH = Dimensions.get("window").width;

const styles = {
    context: {
        fontSize: 18,
        //color: "#888",
        padding: 10,
    },
    flexContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    itemContainer: { padding: 10 },
    accountButton: {
        flexGrow: 1,
    },
    bottomBorder: {
        borderBottomWidth: 1,
        borderBottomColor: "#888",
    },
    avatar: {
        width: SCREEN_WIDTH / 8,
        height: SCREEN_WIDTH / 8,
        borderRadius: SCREEN_WIDTH / 16,
        marginRight: 10,
    },
    acct: {
        fontWeight: "bold",
    },
    moderateMenu: {
        marginLeft: "auto",
        marginRight: 10,
    },
    ellipsis: {
        width: 20,
        height: 20,
    },
};

export { UserList as default };
