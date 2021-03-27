import React from "react";
import {
    SafeAreaView,
    View,
    Image,
    Text,
    FlatList,
    Dimensions,
    TouchableOpacity,
} from "react-native";

import { ScreenWithBackBarJsx } from "src/components/navigation/navigators.js";
import ModerateMenuJsx from "src/components/moderate-menu.js";

const TEST_PROFILE = {
    username: "njms",
    acct: "njms",
    display_name: "Nat🔆",
    locked: false,
    bot: false,
    note: "Yeah heart emoji.",
    avatar: "https://cache.desktopnexus.com/thumbseg/2255/2255124-bigthumbnail.jpg",
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

const TEST_DATA = [
    {...TEST_PROFILE, id: 1},
    {...TEST_PROFILE, id: 2},
    {...TEST_PROFILE, id: 3},
    {...TEST_PROFILE, id: 4},
    {...TEST_PROFILE, id: 5},
    {...TEST_PROFILE, id: 6}
]

function renderItemFactory(navigation) {
    // Returns a renderItem function with the context of props.navigation so
    // that it can enable the person to navigate to the selected account.
    return ({item}) => (
        <View style = { [ styles.flexContainer, styles.itemContainer ] }>
            <TouchableOpacity
              style = { styles.accountButton }
              onPress = {
                () => {
                    navigation.navigate("Profile", { acct: item.acct });
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
            <ModerateMenuJsx
                containerStyle = { styles.moderateMenu }
                triggerStyle = { styles.ellipsis } />
        </View>
    );
}

const UserListJsx = ({navigation}) => {
    // const data = navigation.getParam("data", [])
    const data = TEST_DATA;
    const context = navigation.getParam("context", "");

    const renderItem = renderItemFactory(navigation);

    return (
        <ScreenWithBackBarJsx navigation = { navigation }>
            {
                context ?
                    <Text style = { styles.context }>
                        { context }:
                    </Text>
                    : <></>
            }
            <FlatList
                data = { data }
                renderItem = { renderItem }
                keyExtractor = { item => item.id }/>
        </ScreenWithBackBarJsx>
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

export { UserListJsx as default };
