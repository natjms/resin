import React, { useState } from "react";
import { View, TextInput, Text, Dimensions, Image } from "react-native";
import { ScreenWithTrayJsx } from "src/components/navigation/navigators";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const TEST_IMAGE = "https://cache.desktopnexus.com/thumbseg/2255/2255124-bigthumbnail.jpg";
const TEST_ACCOUNTS = [
    {
        id: 1,
        avatar: TEST_IMAGE,
        username: "njms",
        acct: "njms",
        display_name: "Nathan Scott"
    },
    {
        id: 1,
        avatar: TEST_IMAGE,
        username: "njms",
        acct: "njms",
        display_name: "Nathan Scott"
    }
];

const TEST_HASHTAGS = [
    {
        name: "hashtag1"
    },
    {
        name: "hashtag2"
    },
];

function navCallbackFactory(navigation, route) {
    return params => {
        console.log("test")
        navigation.navigate(route, params);
    }
}

const SearchJsx = ({navigation}) => {
    let [state, setState] = useState({
        query: "",
    });

    const accountCallback = navCallbackFactory(navigation, "ViewProfile");
    const hashtagCallback = navCallbackFactory(navigation, "ViewHashtag");

    return (
        <ScreenWithTrayJsx
             active = "Discover"
             navigation = { navigation }>
            <View style = { styles.form }>
                <TextInput
                    style = { styles.searchBar }
                    placeholder = "Search..."
                    autoFocus
                    onChangeText = { q => setState({query: q}) }
                    onBlur = {
                        () => {
                            if (state.query == "") {
                                navigation.navigate("Discover");
                            }
                        }
                    }
                    value = { state.query } />
            </View>
            { state.query == "" ?
                <View></View>
                : <View>
                        <Text>Accounts</Text>
                        <AccountsListJsx
                            data = { TEST_ACCOUNTS }
                            callback = { accountCallback } />
                        <Text>Hashtags</Text>
                        <HashtagListJsx 
                            data = { TEST_HASHTAGS }
                            callback = { hashtagCallback } />
                </View>
            }
        </ScreenWithTrayJsx>
    );
};

const SearchItemJsx = (props) => {
    return (
        <TouchableWithoutFeedback
             onPress = { () => props.callback(props.params) }>
            <View style = { styles.searchResultContainer }>
                <Image
                    style = { styles.thumbnail }
                    source = { props.thumbnail } />
                <View style = { styles.queried }>
                    { props.children }
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const AccountsListJsx = (props) => {
    return (
        <View style = { styles.searchList }>
            {
                props.data.map(item => {
                    return (
                        <SearchItemJsx
                             key = { item.id }
                             thumbnail = { { uri: item.avatar } }
                             callback = { props.callback }
                             params = { { acct: item.acct } }>
                            <Text style = { styles.username }>
                                { item.username }
                            </Text>
                            <Text style = { styles.displayName }>
                                { item.display_name }
                            </Text>
                        </SearchItemJsx>
                    );
                })
            }
        </View>
    );
};

const HashtagListJsx = (props) => {
    return (
        <View style = { styles.searchList }>
            {
                props.data.map(item => {
                    return (
                        <SearchItemJsx
                             key = { item.id }
                             thumbnail = { require("assets/hashtag.png") }
                             callback = { props.callback }
                             params = { { name: item.name } }>
                            <Text style = { styles.username }>
                                #{ item.name }
                            </Text>
                        </SearchItemJsx>
                    );
                })
            }
        </View>
    );
}

const styles = {
    form: {
        display: "flex",
        justifyContent: "center",
        backgroundColor: "white",
        padding: 20
    },
    searchBar: {
        padding: 10,
        fontSize: 17,
        color: "#888"
    },
    searchList: { padding: 0 },
    searchResultContainer: {
        display: "flex",
        flexDirection: "row",
        padding: 5,
        paddingLeft: 20,
    },
    queried: {
        display: "flex",
        justifyContent: "center",
    },
    username: { fontWeight: "bold" },
    displayName: { color: "#888" },
    thumbnail: {
        width: 50,
        height: 50,
        borderRadius: "100%",
        marginRight: 10,
    }
}

export default SearchJsx;