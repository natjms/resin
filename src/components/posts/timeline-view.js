import React, { useState, useEffect } from "react";
import { View } from "react-native";

import { PostByData } from "src/components/posts/post";

const TimelineView = (props) => {
    // Count the number of posts that have already loaded
    const [postsLoaded, setPostsLoaded] = useState(0);

    // Ensure only posts with media get in the timeline
    const posts = props.posts.filter(
        p => p.media_attachments != null
          && p.media_attachments.length > 0
    );

    useEffect(() => {
        // When all the posts have been loaded, call onTimelineLoaded
        // if it's been defined
        if (postsLoaded == posts.length) {
            if (props.onTimelineLoaded != null) {
                props.onTimelineLoaded();
            }
        }
    }, [postsLoaded]);

    _handlePostLoaded = () => setPostsLoaded(postsLoaded + 1);

    return (
        <View>
            { props.posts.map((post, i) => {
                return (
                    <View key = { i } >
                        <PostByData
                            navigation = { props.navigation }
                            data = { post }
                            onPostLoaded = { _handlePostLoaded }/>
                    </View>
                );
            }) }
        </View>
    );
};

export default TimelineView;
