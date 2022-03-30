import React from "react";
import { View } from "react-native";

import { PostByDataJsx } from "src/components/posts/post";

const TimelineViewJsx = (props) => {
    // Ensure only posts with media get in the timeline
    const posts = props.posts.filter(
        p => p.media_attachments != null
          && p.media_attachments.length > 0
    );

    return (
        <View>
            { props.posts.map((post, i) => {
                return (
                    <View key = { i } >
                        <PostByDataJsx
                            navigation = { props.navigation }
                            data = { post } />
                    </View>
                );
            }) }
        </View>
    );
};

export default TimelineViewJsx;
