import React, { useState, useEffect } from "react";
import {
    Image,
    Text,
    View,
    Dimensions,
    TouchableOpacity
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { activeOrNot } from "src/interface/interactions";

const PostActionJsx = (props) => {
    return (
        <TouchableOpacity
              onPress = { props.onPress }>
            <View style = { { marginLeft: SCREEN_WIDTH / 20 } }>
                <FontAwesome
                    name = { activeOrNot(props.active, props.pack) }
                    size = { 24 }
                    color = {
                        activeOrNot(props.active, {
                            active: "#000",
                            inactive: "#888",
                        })
                    }/>
            </View>
        </TouchableOpacity>
    )
}

const PostActionBarJsx = (props) => {
    const icons = {
        heart: {
            active: "heart",
            inactive: "heart-o",
        },
        reblog: {
            active: "retweet",
            inactive: "retweet",
        },
        bookmark: {
            active: "bookmark",
            inactive: "bookmark-o",
        }
    }
    return (
        <View style = { styles.flexContainer }>
            <PostActionJsx
                pack = { icons.heart }
                active = { props.favourited }
                onPress = { props.onFavourite } />

            <PostActionJsx
                pack = { icons.reblog }
                active = { props.reblogged }
                onPress = { props.onReblog }/>

            <PostActionJsx
                pack = { icons.bookmark }
                active = { props.bookmarked }
                onPress = { props.onBookmark } />
        </View>
    )
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const styles = {
    flexContainer: {
        flexDirection: "row",
        padding: SCREEN_WIDTH / 40
    },
}

export default PostActionBarJsx;
