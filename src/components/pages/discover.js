import React, { useEffect, useState } from "react";
import { View, TextInput, Text, Dimensions } from "react-native";

import { TabView, TabBar, SceneMap } from "react-native-tab-view";

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as requests from "src/requests";

import PagedGridJsx from "src/components/posts/paged-grid";
import { ScreenWithTrayJsx } from "src/components/navigation/navigators";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";


const DiscoverJsx = (props) => {
    const POST_FETCH_PARAMS = {
        only_media: true,
        limit: 18,
    };

    const [ state, setState ] = useState({
        loaded: false,
    });
    const [ index, setIndex ] = useState(0);
    const [ routes ] = useState([
        {
            key: "local",
            icon: "md-home",
        },
        {
            key: "federated",
            icon: "md-planet",
        },
    ]);

    useEffect(() => {
        let instance, accessToken;
        AsyncStorage.
            multiGet([
                "@user_instance",
                "@user_token",
            ])
            .then(([instancePair, tokenPair]) => {
                instance = instancePair[1];
                accessToken = JSON.parse(tokenPair[1]).access_token;

                return Promise.all([
                    requests.fetchPublicTimeline(
                        instance,
                        accessToken,
                        { ...POST_FETCH_PARAMS, local: true, }
                    ),
                    requests.fetchPublicTimeline(
                        instance,
                        accessToken,
                        { ...POST_FETCH_PARAMS, remote: true, }
                    )
                ]);
            })
            .then(([localPosts, federatedPosts]) => {
                setState({...state,
                    localPosts,
                    federatedPosts,
                    instance,
                    accessToken,
                    loaded: true,
                });
            })
    }, []);

    const _handleLocalTabUpdate = async () => {
        const newPosts = await requests.fetchPublicTimeline(
            state.instance,
            state.accessToken,
            {
                ...POST_FETCH_PARAMS,
                local: true,
                max_id: state.localPosts[state.localPosts.length - 1].id
            }
        );

        setState({...state,
            localPosts: state.localPosts.concat(newPosts),
        });
    };

    const _handleFederatedTabUpdate = async () => {
        const lastId = state.federatedPosts[state.federatedPosts.length - 1].id
        const newPosts = await requests.fetchPublicTimeline(
            state.instance,
            state.accessToken,
            {
                ...POST_FETCH_PARAMS,
                remote: true,
                max_id: lastId,
            }
        );

        setState({...state,
            federatedPosts: state.federatedPosts.concat(newPosts),
        });
    };

    const LocalTimeline = () => (
        <PagedGridJsx
            navigation = { props.navigation }
            posts = { state.localPosts }
            onShowMore = { _handleLocalTabUpdate }
            originTab = "Discover" />
    );

    const FederatedTimeline = () => (
        <PagedGridJsx
            navigation = { props.navigation }
            posts = { state.federatedPosts }
            onShowMore = { _handleFederatedTabUpdate }
            originTab = "Discover" />
    );

    const renderScene = SceneMap({
        local: LocalTimeline,
        federated: FederatedTimeline,
    });

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle = { styles.tabBar.indicator }
            activeColor = "#000"
            inactiveColor = "#888"
            renderIcon = { renderIcon }
            style = { styles.tabBar.tab } />
    );

    const renderIcon = ({ route, color }) => (
        <Ionicons
            name = { route.icon }
            size = { 24 }
            color = { color } />
    );

    return (
        <>
            { state.loaded
                ? <ScreenWithTrayJsx
                        active = "Discover"
                        navigation = { props.navigation }
                        statusBarColor = "white">
                    <TouchableWithoutFeedback
                        onPress = { () => props.navigation.navigate("Search") }>
                        <View style = { styles.form }>
                            <View style = { styles.searchBarContainer }>
                                <Text style = { styles.searchBar }>
                                    Search...
                                </Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    <TabView
                        navigationState = { { index, routes } }
                        renderScene = { renderScene }
                        renderTabBar =  { renderTabBar }
                        onIndexChange = { setIndex }
                        initialLayout = { { width: SCREEN_WIDTH } } />
                </ScreenWithTrayJsx>
                : <></>
            }
        </>
    );
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const styles = {
    form: {
        justifyContent: "center",
        backgroundColor: "white",
        padding: 20
    },
    searchBar: {
        padding: 10,
        fontSize: 17,
        color: "#888",
        borderBottomWidth: 1,
        borderBottomColor: "#CCC",
    },

    tabBar: {
        indicator: { backgroundColor: "black" },
        tab: { backgroundColor: "white" },
    },
};

export default DiscoverJsx;
