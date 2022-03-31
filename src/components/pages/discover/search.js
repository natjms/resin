import React, { useState, useEffect } from "react";
import {
    View,
    TextInput,
    Text,
    Dimensions,
    Image,
} from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as requests from "src/requests";
import { StatusBarSpace } from "src/interface/rendering";
import { ScreenWithTrayJsx } from "src/components/navigation/navigators";

import { TouchableOpacity } from "react-native-gesture-handler";

function navCallbackFactory(navigation, route) {
    return params => {
        navigation.navigate(route, params);
    }
}

const SearchJsx = ({navigation}) => {
    // The number of additional items to fetch each time
    const FETCH_LIMIT = 5;

    let [state, setState] = useState({
        query: "",
        loaded: false,
        accountOffset: 0,
        hashtagOffset: 0,
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

                setState({...state,
                    instance,
                    accessToken,
                    loaded: true,
                });
            });
    }, []);

    const _handleSearch = async () => {
        const results = await requests.fetchSearchResults(
            state.instance,
            state.accessToken,
            {
                q: state.query,
                limit: FETCH_LIMIT,
            }
        );

        setState({...state,
            results,
            accountOffset: FETCH_LIMIT,
            hashtagOffset: FETCH_LIMIT,
        });
    };

    const _handleShowMoreAccounts = async () => {
        const { accounts } = await requests.fetchSearchResults(
            state.instance,
            state.accessToken,
            {
                q: state.query,
                type: "accounts",
                offset: state.accountOffset,
                limit: FETCH_LIMIT,
            }
        );

        setState({...state,
            results: {...state.results,
                accounts: state.results.accounts.concat(accounts),
            },
            accountOffset: state.accountOffset + FETCH_LIMIT,
        });
    };

    const _handleShowMoreHashtags = async () => {
        const { hashtags } = await requests.fetchSearchResults(
            state.instance,
            state.accessToken,
            {
                q: state.query,
                type: "hashtags",
                offset: state.hashtagOffset,
                limit: FETCH_LIMIT,
            }
        );

        setState({...state,
            results: {...state.results,
                hashtags: state.results.hashtags.concat(hashtags),
            },
            hashtagOffset: state.hashtagOffset + FETCH_LIMIT,
        });
    };

    const [ index, setIndex ] = useState(0);
    const [ routes ] = useState([
        {
            key: "accounts",
            icon: "user",
        },
        {
            key: "hashtags",
            icon: "hashtag",
        },
    ]);

    const AccountRenderer = () => (
        <AccountListJsx
            callback = { navCallbackFactory(navigation, "ViewProfile") }
            onShowMore = { _handleShowMoreAccounts }
            results = { state.results.accounts }
            offset = { state.accountOffset } />
    );

    const HashtagRenderer = () => (
        <HashtagListJsx
            callback = { navCallbackFactory(navigation, "ViewHashtag") }
            onShowMore = { _handleShowMoreHashtags }
            results = { state.results.hashtags }
            offset = { state.hashtagOffset } />
    );

    const renderScene = SceneMap({
        accounts: AccountRenderer,
        hashtags: HashtagRenderer,
    });

    const renderTabBar = (props) => (
        <TabBar
            { ...props }
            indicatorStyle = { styles.tabBar.indicator }
            activeColor = "#000"
            inactiveColor = "#888"
            renderIcon = { renderIcon }
            style = { styles.tabBar.tab } />
    );

    const renderIcon = ({ route, color }) => (
        <FontAwesome
            name = { route.icon }
            size = { 24 }
            color = { color } />
    );

    return (
        <>
            { state.loaded
                ? <ScreenWithTrayJsx
                      active = "Discover"
                      statusBarColor = "white"
                      navigation = { navigation }>
                    <View style = { styles.form.container }>
                        <TextInput
                            style = { styles.form.input }
                            placeholder = "Search..."
                            autoFocus
                            onSubmitEditing = { _handleSearch }
                            onChangeText = {
                                q => setState({ ...state, query: q })
                            }
                            onBlur = {
                                () => {
                                    if (state.query == "") {
                                        navigation.navigate("Discover");
                                    }
                                }
                            }
                            value = { state.query } />
                        <TouchableOpacity
                              onPress = { _handleSearch }
                              style = { styles.form.submit }>
                            <FontAwesome name="search" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    { state.results
                        ? <TabView
                            navigationState = { { index, routes } }
                            renderScene = { renderScene }
                            renderTabBar =  { renderTabBar }
                            onIndexChange = { setIndex }
                            initialLayout = { { width: SCREEN_WIDTH } } />
                        : <></>
                    }
                </ScreenWithTrayJsx>
                : <></>
            }
        </>
    );
};

const SearchItemJsx = (props) => {
    return (
        <TouchableOpacity
             onPress = { () => props.callback(props.navParams) }>
            <View style = { styles.searchResultContainer }>
                <Image
                    style = { styles.thumbnail }
                    source = { props.thumbnail } />
                <View style = { styles.queried }>
                    { props.children }
                </View>
            </View>
        </TouchableOpacity>
    );
};

// Display message noting when no results turned up. This component wraps
// AccountListJsx and HashtagListJsx.
const SearchListContainerJsx = ({ results, children }) => results.length == 0
    ? <View style = { styles.noResultsContainer }>
        <Text>No results!</Text>
    </View>
    : children;

const AccountListJsx = (props) => {
    return (
        <SearchListContainerJsx results = { props.results }>
            <View style = { styles.searchList }>
                <>
                    {
                        props.results.map(item => {
                            return (
                                <SearchItemJsx
                                     key = { item.id }
                                     thumbnail = { { uri: item.avatar } }
                                     callback = { props.callback }
                                     navParams = { { profile: item } }>
                                    <Text style = { styles.username }>
                                        { item.acct }
                                    </Text>
                                    <Text style = { styles.displayName }>
                                        { item.display_name }
                                    </Text>
                                </SearchItemJsx>
                            );
                        })
                    }
                </>
                <>
                    { props.results.length == props.offset
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
            </View>
        </SearchListContainerJsx>
    );
};

const HashtagListJsx = (props) => {
    return (
        <SearchListContainerJsx results = { props.results }>
            <View style = { styles.searchList }>
                <>
                    {
                        props.results.map((item, i) => {
                            return (
                                <SearchItemJsx
                                     key = { i }
                                     thumbnail = { require("assets/hashtag.png") }
                                     callback = { props.callback }
                                     navParams = { { tag: item } }>
                                    <Text style = { styles.username }>
                                        #{ item.name }
                                    </Text>
                                </SearchItemJsx>
                            );
                        })
                    }
                </>
                <>
                    { props.results.length == props.offset
                        ? <View style = { styles.showMore.container }>
                            <TouchableOpacity
                                    onPress = { props.onShowMore }>
                                <View style = { styles.showMore.button }>
                                    <Text>Show more?</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        :<></>
                    }
                </>
            </View>
        </SearchListContainerJsx>
    );
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const styles = {
    form: {
        container: {
            flexDirection: "row",
            justifyContent: "center",
            backgroundColor: "white",
            padding: 20,
        },

        input: {
            flexGrow: 1,
            padding: 10,
            fontSize: 17,
            color: "#888"
        },

        submit: {
            padding: 20,
        }
    },

    label: {
        padding: 10,
        fontSize: 15,
    },

    searchList: { padding: 0 },

    searchResultContainer: {
        display: "flex",
        flexDirection: "row",
        padding: 5,
        paddingLeft: 20,
    },

    noResultsContainer: {
        paddingTop: SCREEN_HEIGHT / 4,
        alignItems: "center",
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
        borderRadius: 25,
        marginRight: 10,
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

    tabBar: {
        indicator: { backgroundColor: "black" },
        tab: { backgroundColor: "white" },
    },
}

export default SearchJsx;
