import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as requests from "src/requests";
import { ScreenWithBackBarJsx } from "src/components/navigation/navigators";
import PagedGridJsx from "src/components/posts/paged-grid";

// The number of posts to fetch at a time
const POST_FETCH_LIMIT = 18;

const OlderPostsJsx = (props) => {
    const [ state, setState ] = useState({
        loaded: false,
    });

    useEffect(() => {
        let instance, accessToken, latestId;
        AsyncStorage
            .multiGet([
                "@user_instance",
                "@user_token",
                "@user_latestPostId"
            ])
            .then(([instancePair, tokenPair, latestPair]) => {
                instance = instancePair[1];
                accessToken = JSON.parse(tokenPair[1]).access_token;
                latestId = JSON.parse(latestPair[1]);

                return requests.fetchHomeTimeline(instance, accessToken, {
                    max_id: latestId,
                    limit: POST_FETCH_LIMIT,
                })
            })
            .then(posts => {
                setState({...state,
                    posts: posts,
                    instance: instance,
                    accessToken: accessToken,
                    loaded: true,
                });
            })
    }, []);

    const _handleShowMore = async () => {
        const newPosts = await requests.fetchHomeTimeline(
            state.instance,
            state.accessToken,
            {
                max_id: state.posts[state.posts.length - 1].id,
                limit: POST_FETCH_LIMIT,
            }
        );

        setState({...state,
            posts: state.posts.concat(newPosts),
        });
    };

    return (
        <>
            { state.loaded
                ? <ScreenWithBackBarJsx navigation = { props.navigation }>
                    <PagedGridJsx
                        posts = { state.posts }
                        onShowMore = { _handleShowMore }
                        navigation = { props.navigation }/>
                </ScreenWithBackBarJsx>
                : <></>
            }
        </>
    );
};

export default OlderPostsJsx;
