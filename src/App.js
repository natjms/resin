import 'react-native-gesture-handler';
import React from "react";

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from "react-navigation-stack";
import { MenuProvider } from "react-native-popup-menu";

import { registerRootComponent } from 'expo';
import * as Linking from "expo-linking";

import ViewPostJsx from "src/components/pages/view-post";
import ViewCommentsJsx from "src/components/pages/view-comments.js";

import AuthenticateJsx from "src/components/pages/authenticate";
import FeedJsx from "src/components/pages/feed";
import PublishJsx from "src/components/pages/publish";
import OlderPostsJsx from "src/components/pages/feed/older-posts";
import ProfileJsx, { ViewProfileJsx } from "src/components/pages/profile";
import DiscoverJsx from 'src/components/pages/discover';
import SearchJsx from 'src/components/pages/discover/search';
import ViewHashtagJsx from 'src/components/pages/discover/view-hashtag';
import DirectJsx from "src/components/pages/direct";
import ConversationJsx, { ComposeJsx } from "src/components/pages/direct/conversation";
import NotificationsJsx from 'src/components/pages/profile/notifications';
import UserListJsx from "src/components/pages/user-list.js";
import SettingsJsx from "src/components/pages/profile/settings.js";

const Stack = createStackNavigator({
    Authenticate: {
        screen: AuthenticateJsx,
        path: "authenticate",
    },
    Feed: { screen: FeedJsx, },
    OlderPosts: { screen: OlderPostsJsx },
    Discover: { screen: DiscoverJsx },
    Publish: { screen: PublishJsx },
    Direct: { screen: DirectJsx },
    Compose: { screen: ComposeJsx },
    Conversation: { screen: ConversationJsx },
    Notifications: { screen: NotificationsJsx },
    Profile: { screen: ProfileJsx, },
    Settings: { screen: SettingsJsx },
    Search: { screen: SearchJsx },
    ViewPost: { screen: ViewPostJsx },
    ViewComments: { screen: ViewCommentsJsx },
    ViewProfile: { screen: ViewProfileJsx },
    ViewHashtag: { screen: ViewHashtagJsx },
    UserList: { screen: UserListJsx }
}, {
    initialRouteKey: "Authenticate",
    headerMode: "none",
    navigationOptions: {
        headerVisible: false
    }
});

const AppContainer = createAppContainer(Stack);

const prefix = Linking.makeUrl("/");

const App = (props) => {
    const providerStyles = {
        backdrop: {
            backgroundColor: "black",
            opacity: 0.5
        }
    };

    return <MenuProvider customStyles = { providerStyles }>
        <AppContainer uriPrefix = { prefix }/>
    </MenuProvider>;
};

export default registerRootComponent(App);
