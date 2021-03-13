import 'react-native-gesture-handler';


import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from "react-navigation-stack";

import { registerRootComponent } from 'expo';

import ViewPostJsx from "src/components/pages/view-post";
import ViewCommentsJsx from "src/components/pages/view-comments.js";

import FeedJsx from "src/components/pages/feed";
import ProfileJsx, { ViewProfileJsx } from "src/components/pages/profile";
import DiscoverJsx from 'src/components/pages/discover';
import SearchJsx from 'src/components/pages/discover/search';
import ViewHashtagJsx from 'src/components/pages/discover/view-hashtag';
import NotificationsJsx from 'src/components/pages/profile/notifications';

const Stack = createStackNavigator({
  Feed: { screen: FeedJsx, },
  Discover: { screen: DiscoverJsx },
  Notifications: { screen: NotificationsJsx },
  Profile: { screen: ProfileJsx, },
  Search: { screen: SearchJsx },
  ViewPost: { screen: ViewPostJsx },
  ViewComments: { screen: ViewCommentsJsx },
  ViewProfile: { screen: ViewProfileJsx },
  ViewHashtag: { screen: ViewHashtagJsx }
}, {
  initialRouteKey: "Feed",
  headerMode: "none",
  navigationOptions: {
    headerVisible: false
  }
});

const App = createAppContainer(Stack);

export default registerRootComponent(App);
