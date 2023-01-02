import 'react-native-gesture-handler';
import React from "react";

import { LogBox } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { MenuProvider } from "react-native-popup-menu";

import { registerRootComponent } from 'expo';
import * as Linking from "expo-linking";

import Icon from "src/components/icons.js";
import ViewPost from "src/components/pages/view-post";
import ViewComments from "src/components/pages/view-comments.js";

import Authenticate from "src/components/pages/authenticate";
import Feed from "src/components/pages/feed";
import Publish from "src/components/pages/publish";
import OlderPosts from "src/components/pages/feed/older-posts";
import Profile, { ViewProfile } from "src/components/pages/profile";
import Discover from 'src/components/pages/discover';
import Search from 'src/components/pages/discover/search';
import ViewHashtag from 'src/components/pages/discover/view-hashtag';
import Direct from "src/components/pages/direct";
import Conversation, { Compose } from "src/components/pages/direct/conversation";
import UserList from "src/components/pages/user-list.js";
import Settings from "src/components/pages/profile/settings.js";

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
]);

const prefix = Linking.makeUrl("/");
const Tab = createBottomTabNavigator();

const MainNavigator = () => {
    // Tabbed navigator for Feed, Discover, Publish, Direct and Profile

    const bottomTabIcon = name => {
        return ({ size, focused }) =>
            <Icon 
                name = { name }
                size = { size }
                focused = { focused }/>
    };

    const screenOptions = {
        all: {
            // Options that apply to every screen in the navigator
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
                height: 60,
            },
        },
        Feed: {
            tabBarAccessibilityLabel: "Feed",
            tabBarIcon: bottomTabIcon("feed"),
        },
        Discover: {
            tabBarAccessibilityLabel: "Discover",
            tabBarIcon: bottomTabIcon("search"),
        },
        Publish: {
            tabBarAccessibilityLabel: "Publish",
            tabBarIcon: bottomTabIcon("camera"),
        },
        Direct: {
            tabBarAccessibilityLabel: "Direct messages",
            tabBarIcon: bottomTabIcon("mail"),
        },
        Profile: {
            tabBarAccessibilityLabel: "Profile",
            tabBarIcon: bottomTabIcon("person"),
        },
    };

    return (
        <Tab.Navigator
              intialRouteName = "Feed"
              screenOptions = { screenOptions.all }>
            <Tab.Screen name = "Feed" component = { Feed }
                options = { screenOptions.Feed }/>
            <Tab.Screen name = "Discover" component = { Discover }
                options = { screenOptions.Discover }/>
            <Tab.Screen name = "Publish" component = { Publish }
                options = { screenOptions.Publish }/>
            <Tab.Screen name = "Direct" component = { Direct }
                options = { screenOptions.Direct }/>
            <Tab.Screen name = "Profile" component = { Profile }
                options = { screenOptions.Profile }/>
        </Tab.Navigator>
    );
};

const Stack = createStackNavigator();

const App = (props) => {
    const providerStyles = {
        backdrop: {
            backgroundColor: "black",
            opacity: 0.5
        },
    };

    // This allows for the OAuth redirect
    const linking = {
        prefixes: [prefix],
        config: {
            screens: {
                Authenticate: "authenticate",
            },
        },
    };

    const screenOptions = {
        headerTitle: "",
    };

    return <MenuProvider customStyles = { providerStyles }>
        <NavigationContainer linking = { linking }>
            <Stack.Navigator
                  intialRouteName = "Authenticate"
                  screenOptions = { screenOptions }>
                <Stack.Screen
                    name = "Authenticate"
                    component = { Authenticate }
                    options = { { headerShown: false } }/>
                <Stack.Screen
                    name = "Main"
                    component = { MainNavigator }
                    options = { { headerShown: false } }/>
                <Stack.Screen name="OlderPosts" component={OlderPosts}/>
                <Stack.Screen name="Compose" component={Compose}/>
                <Stack.Screen name="Conversation" component={Conversation}/>
                <Stack.Screen name="Settings" component={Settings}/>
                <Stack.Screen name="Search" component={Search}
                    options = { { headerShown: false } }/>
                <Stack.Screen name="ViewPost" component={ViewPost}/>
                <Stack.Screen name="ViewComments" component={ViewComments}/>
                <Stack.Screen name="ViewProfile" component={ViewProfile}/>
                <Stack.Screen name="ViewHashtag" component={ViewHashtag}/>
                <Stack.Screen name="UserList" component={UserList}/>
            </Stack.Navigator>
        </NavigationContainer>
    </MenuProvider>;
};

export default registerRootComponent(App);
