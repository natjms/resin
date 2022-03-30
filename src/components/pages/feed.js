import React, { useState, useEffect } from "react";
import { Dimensions, View, Image, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';

import TimelineViewJsx from "src/components/posts/timeline-view";
import { ScreenWithTrayJsx } from "src/components/navigation/navigators";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

import AsyncStorage from "@react-native-async-storage/async-storage";

import * as requests from "src/requests";

const FeedJsx = (props) => {
    const [state, setState] = useState({
        loaded: false,
        postsRendered: false,
    });

    useEffect(() => {
        let accessToken, instance, posts;

        AsyncStorage
            .multiGet([
                "@user_token",
                "@user_instance",
                "@user_latestPostId",
            ])
            .then(([tokenPair, instancePair, latestPair]) => {
                accessToken = JSON.parse(tokenPair[1]).access_token;
                instance = instancePair[1];
                // NOTE: `latest` is just a number, but the Pixelfed API will
                // not accept query params like ?min_id="123" so it must be
                // parsed
                const latest = JSON.parse(latestPair[1]);
                const params = { limit: 20 };

                if (latest) {
                    // @user_latestPostId will be null the first time the feed
                    // is opened, so there's no need to specify it here.
                    params["min_id"] = latest;
                }

                return requests.fetchHomeTimeline(
                    instance,
                    accessToken,
                    params
                )
            })
            .then(retrievedPosts => {
                posts = retrievedPosts;
                if(posts.length > 0) {
                    const latestId = posts[0].id;
                    return AsyncStorage.setItem(
                        "@user_latestPostId",
                        JSON.stringify(latestId)
                    );
                }
            })
            .then(() =>
                setState({...state,
                    posts,
                    loaded: true,
                })
            );
    }, []);

    const _handleTimelineLoaded = () => setState({...state,
        postsRendered: true,
    });

    let endOfTimelineMessage = <></>;
    if (state.postsRendered) {
        // Only render the timeline interruption if all of the posts have been
        // rendered in the feed.
        endOfTimelineMessage = <>
            <View style = {
                state.posts.length == 0
                    ? {}
                    : styles.interruption.topBorder
              }>
                <View style = { styles.interruption.inner }>
                    <Ionicons
                        name="ios-checkmark-circle-outline"
                        size= { 150 }
                        color="black" />

                    <Text style = { styles.interruption.header }>
                        You're all caught up.
                    </Text>
                    <Text> Wow, it sure is a lovely day outside 🌳 </Text>
    
                    <TouchableWithoutFeedback
                            style = { styles.interruption.button }
                            onPress = {
                                () => props.navigation.navigate("OlderPosts")
                            }>
                        <Text> See older posts </Text>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        </>;
    }

    return (
        <>
            { state.loaded
                ? <ScreenWithTrayJsx
                        active = "Feed"
                        contentContainerStyle = {
                            state.posts.length == 0
                                ? styles.ifCaughtUp
                                : {}
                        }
                        navigation = { props.navigation }>

                    <TimelineViewJsx
                            navigation = { props.navigation }
                            posts = { state.posts }
                            onTimelineLoaded = { _handleTimelineLoaded }/>
                    { endOfTimelineMessage }
                </ScreenWithTrayJsx>
                : <></>
            }
        </>
    );
};

const screen_width = Dimensions.get("window").width;
const screen_height = Dimensions.get("window").height;
const styles = {
    timeline: {
        height: screen_height - (screen_height / 12)
    },
    ifCaughtUp: {
        flexGrow: 1,
        justifyContent: "center",
    },
    interruption: {
        topBorder: {
            borderTopWidth: 1,
            borderTopColor: "#CCC",
        },
        inner: {
            marginTop: 10,
            marginBottom: 10,

            justifyContent: "center",
            alignItems: "center",
        },
        header: {
            fontSize: 21
        },
        button: {
            borderWidth: 1,
            borderColor: "#888",
            borderRadius: 5,

            margin: 30,
            padding: 5
        },
    },
};

export default FeedJsx;
