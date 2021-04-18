import React, { useState, useEffect } from "react";
import {
    Image,
    Text,
    View,
    Dimensions,
    TouchableWithoutFeedback
} from "react-native";
import { activeOrNot } from "src/interface/interactions";

const PostActionJsx = (props) => {
    return (
        <TouchableWithoutFeedback
            onPress = { props.callback }>
            <Image
                source = {
                    activeOrNot(props.state[props.field], props.pack)
                }
                style = {
                    [
                        styles.icon,
                        props.last ? styles.lastIcon : {}
                    ]
                } />
        </TouchableWithoutFeedback>
    )
}

const PostActionBarJsx = (props) => {
    let [state, setState] = useState({
        favourited: props.favourited,
        commenting: false,
        reblogged: props.reblogged,
        bookmarked: false
    });

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
                state = { state }
                callback = {
                    () => {
                        setState({ ...state, favourited: !state.favourited });
                    }
                } />

            <PostActionJsx
                field = "reblogged"
                pack = { icons.reblog }
                state = { state }
                callback = {
                    () => {
                        setState({ ...state, reblogged: !state.reblogged });
                    }
                } />

            <PostActionJsx
                field = "bookmarked"
                pack = { icons.bookmark }
                last = { true }
                state = { state }
                callback = {
                    () => {
                        setState({ ...state, bookmarked: !state.bookmarked });
                    }
                } />
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
