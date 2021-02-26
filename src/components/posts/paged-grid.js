import React, { useState, useEffect } from "react";
import { View, TouchableWithoutFeedback, Text } from "react-native";

import GridViewJsx from "src/components/posts/grid-view";

const TEST_IMAGE = "https://cache.desktopnexus.com/thumbseg/2255/2255124-bigthumbnail.jpg";
const TEST_POSTS = [
    {
        id: 1,
        media_attachments: [
            {preview_url: TEST_IMAGE}
        ]
    },
    {
        id: 2,
        media_attachments: [
            {preview_url: TEST_IMAGE}
        ]
    },
    {
        id: 3,
        media_attachments: [
            {preview_url: TEST_IMAGE}
        ]
    },
    {
        id: 4,
        media_attachments: [
            {preview_url: TEST_IMAGE}
        ]
    }
];

const PagedGridJSX = (props) => {
    let [state, setState] = useState({
        posts: [],
        loaded: false
    });

    useEffect(() => {
        if (!state.loaded) {
            // TODO: actually get posts :)
            setState({
                posts: TEST_POSTS,
                loaded: true
            });
        }
    });

    return (
        <View>
            <GridViewJsx 
                    posts = { state.posts }
                    openPostCallback = {
                        (id) => {
                            props.navigation.navigate("ViewPost", {
                                id: id,
                                originTab: props.navigation.getParam("originTab")
                            });
                        }
                    } />
            <View style = { styles.buttonContainer }>
                <TouchableWithoutFeedback
                        onPress = { () => {
                            // TODO: actually get more posts :)
                            let morePosts = state.posts.concat(TEST_POSTS);
                            setState({ posts: morePosts, loaded: true });
                        } }>
                    <View style = { styles.buttonMore }>
                        <Text>Show more?</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
}

const styles = {
    buttonContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    buttonMore: {
        border: "2px solid black",
        borderRadius: 5,
        padding: 10,
        margin: 20
    }
}

export default PagedGridJSX;