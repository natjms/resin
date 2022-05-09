import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text } from "react-native";

import GridView from "src/components/posts/grid-view";

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
    return (
        <View>
            <GridView
                    posts = { props.posts }
                    navigation = { props.navigation }
                    openPostCallback = {
                        (id) => {
                            props.navigation.navigate("ViewPost", {
                                id: id,
                                originTab: props.navigation.getParam("originTab")
                            });
                        }
                    } />
            <View style = { styles.buttonContainer }>
                <TouchableOpacity
                        onPress = { props.onShowMore }>
                    <View style = { styles.buttonMore }>
                        <Text>Show more?</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = {
    buttonContainer: {
        justifyContent: "center",
        alignItems: "center"
    },
    buttonMore: {
        borderWidth: 1,
        borderColor: "#888",
        borderRadius: 5,
        padding: 10,
        margin: 20
    }
}

export default PagedGridJSX;
