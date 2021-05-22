import React, { useState, useEffect } from "react";
import {
    Image,
    Text,
    View,
    Dimensions,
    TouchableOpacity
} from "react-native";
import { activeOrNot } from "src/interface/interactions";

const PostActionJsx = (props) => {
    return (
        <TouchableOpacity
            onPress = { props.onPress }>
            <Image
                source = {
                    activeOrNot(props.active, props.pack)
                }
                style = {
                    [
                        styles.icon,
                        props.last ? styles.lastIcon : {}
                    ]
                } />
        </TouchableOpacity>
    )
}

const PostActionBarJsx = (props) => {
    const icons = {
        heart: {
            active: require("assets/eva-icons/post-actions/heart-active.png"),
            inactive: require("assets/eva-icons/post-actions/heart-inactive.png")
        },
        reblog: {
            active: require("assets/eva-icons/post-actions/reblog-active.png"),
            inactive: require("assets/eva-icons/post-actions/reblog-inactive.png")
        },
        bookmark: {
            active: require("assets/eva-icons/post-actions/bookmark-active.png"),
            inactive: require("assets/eva-icons/post-actions/bookmark-inactive.png")
        }
    }
    return (
        <View style = { styles.flexContainer }>
            <PostActionJsx
                field = "favourited"
                pack = { icons.heart }
                active = { props.favourited }
                onPress = { props.onFavourite } />

            <PostActionJsx
                field = "reblogged"
                pack = { icons.reblog }
                reblogged = { props.reblogged }
                onPress = { props.onReblog }/>

            <PostActionJsx
                field = "bookmarked"
                pack = { icons.bookmark }
                last = { true }
                bookmarked = { props.bookmarked }
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
    icon: {
        width: 30,
        height: 30,
        marginRight: SCREEN_WIDTH / 20
    },
    lastIcon: {
        marginLeft: "auto"
    }
}

export default PostActionBarJsx;
