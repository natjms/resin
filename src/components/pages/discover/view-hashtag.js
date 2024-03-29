import React, { useState, useEffect } from "react";
import { ScrollView, View, Image, Dimensions, Text } from "react-native";
import PagedGrid from "src/components/posts/paged-grid";

import * as requests from "src/requests";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ViewHashtag = ({ navigation, route }) => {
    const FETCH_LIMIT = 18;
    let [state, setState] = useState({
        tag: route.params.tag,
        posts: [],
        offset: 0,
        followed: false,
        loaded: false,
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

                return requests.fetchHashtagTimeline(
                    instance,
                    state.tag.name,
                    accessToken,
                    {
                        only_media: true,
                        limit: FETCH_LIMIT,
                    }
                );
            })
            .then(posts => {
                setState({...state,
                    posts,
                    offset: state.offset + FETCH_LIMIT,
                    instance,
                    accessToken,
                    loaded: true,
                });
            });
    }, []);


    const _handleShowMore = async () => {
        const newPosts = await requests.fetchHashtagTimeline(
            state.instance,
            state.tag.name,
            state.accessToken,
            {
                only_media: true,
                limit: FETCH_LIMIT,
                max_id: state.offset,
            }
        );

        setState({...state,
            posts: state.posts.concat(newPosts),
            offset: state.offset + FETCH_LIMIT,
        });
    };

    // A hashtag's history describes how actively it's being used. There's
    // one element in the history array for every set interval of time.
    // state.tag.history may be undefined, and its length might be 0.
    let latest = null;
    if (state.tag.history && state.tag.history.length > 0) {
        latest = state.tag.history[0];
    }

    return (
        <ScrollView>
            <View>
                <View style = { styles.headerContainer }>
                    <View>
                        <Image
                            style = { styles.image }
                            source = {
                                state.loaded && state.posts.length > 0
                                    ? {
                                        uri: state
                                            .posts[0]
                                            .media_attachments[0]
                                            .preview_url
                                    }
                                    : require("assets/hashtag.png")
                            }/>
                    </View>
                    <View style = { styles.headerText }>
                        <Text style = { styles.hashtag }>
                            #{ state.tag.name }
                        </Text>
                        <>
                            { latest
                                ? <Text>
                                    <Text style = { styles.strong }>{ latest.uses }</Text>&nbsp;
                                    posts from&nbsp;
                                    <Text style = { styles.strong }>{ latest.accounts }</Text>&nbsp;
                                    people today
                                </Text>
                                :<></>
                            }
                        </>
                    </View>
                </View>
                <>
                    { state.loaded && state.posts.length > 0
                        ? state.posts.length > 0
                            ? <PagedGrid
                                navigation = { navigation }
                                posts = { state.posts }
                                onShowMore = { _handleShowMore } />
                            : <Text style = { styles.nothing }>
                                Nothing to show
                            </Text>
                        : <></>
                    }
                </>
            </View>
        </ScrollView>
    );
};

const screen_width = Dimensions.get("window").width;
const styles = {
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
    },
    image: {
        width: screen_width / 3,
        height: screen_width / 3,
        borderWidth: 1,
        borderColor: "#888",
        borderRadius: screen_width / 6,
        marginRight: 20,
    },
    hashtag: {
        fontWeight: "bold",
        fontSize: 20
    },
    nothing: {
        color: "#666",
        textAlign: "center",
        paddingTop: 20,
    },
    strong: {
        fontWeight: "bold",
    },
}

export default ViewHashtag;
