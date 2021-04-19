import React, { useEffect, useState } from "react";
import { View, TextInput, Text, Dimensions } from "react-native";

import { TabView, TabBar, SceneMap } from "react-native-tab-view";

import { Ionicons } from "@expo/vector-icons";

import PagedGridJsx from "src/components/posts/paged-grid";
import { ScreenWithTrayJsx } from "src/components/navigation/navigators";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const DiscoverJsx = (props) => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        {
            key: "home",
            icon: "md-home",
        },
        {
            key: "federated",
            icon: "md-planet",
        },
    ]);

    const HomeTimeline = () => (
        <PagedGridJsx
            navigation = { props.navigation }
            originTab = "Discover" />
    );

    const FederatedTimeline = () => (
        <PagedGridJsx
            navigation = { props.navigation }
            originTab = "Discover" />
    );

    const renderScene = SceneMap({
        home: HomeTimeline,
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
        <ScreenWithTrayJsx
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
