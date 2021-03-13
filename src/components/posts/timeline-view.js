import React from "react";
import { View } from "react-native";

import { PostByDataJsx } from "src/components/posts/post";

const TimelineViewJsx = (props) => {
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
