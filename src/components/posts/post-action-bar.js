import React, { useState, useEffect } from "react";
import { 
    Image,
    View,
    Dimensions,
    TouchableWithoutFeedback
} from "react-native";
import { activeOrNot } from "src/interface/interactions";

function invertField (field, state, updater) {
    // Takes a function (like `setState`) and uses it to invert the given field of `state`
    let newState = state;
    newState[field] = !newState[field];
    updater(newState);
}

// These callbacks will eventually make calls to the instance's API
function favouritedCallback(state, updater) {
    invertField("favourited", state, updater);
}

function commentCallback(state, updater) {
    invertField("commenting", state, updater);
}

function reblogCallback(state, updater) {
    invertField("reblogged", state, updater);
}

function downloadCallback(state, updater) {
    let newState = state;
    newState.downloaded = true;
    updater(newState);
}

const PostActionJsx = (props) => {
    return (
        <TouchableWithoutFeedback
            onPress = { props.callback }>
            <Image
                source = {
                    activeOrNot(props.state[props.field], props.pack)
                }
                style = { styles.icon } />
        </TouchableWithoutFeedback>
    )
}

const PostActionBarJsx = (props) => {
    let [state, setState] = useState({
        favourited: props.favourited,
        commenting: false,
        reblogged: props.reblogged,
        downloaded: false
    });

    const icons = {
        heart: {
            active: require("assets/eva-icons/post-actions/heart-active.png"),
            inactive: require("assets/eva-icons/post-actions/heart-inactive.png")
        },
        comment: {
            active: require("assets/eva-icons/post-actions/comment-active.png"),
            inactive: require("assets/eva-icons/post-actions/comment-inactive.png")
        },
        reblog: {
            active: require("assets/eva-icons/post-actions/reblog-active.png"),
            inactive: require("assets/eva-icons/post-actions/reblog-inactive.png")
        },
        download: {
            active: require("assets/eva-icons/post-actions/download-active.png"),
            inactive: require("assets/eva-icons/post-actions/download-inactive.png")
        }
    }
    return (
        <View style = { styles.flexContainer }>
            <PostActionJsx
                field = "favourited"
                pack = { icons.heart }
                state = { state }
                callback = { () => favouritedCallback(state, setState) } />
            
            <PostActionJsx
                field = "commenting"
                pack = { icons.comment }
                state = { state }
                callback = { () => commentCallback(state, setState) } />
            
            <PostActionJsx
                field = "reblogged"
                pack = { icons.reblog }
                state = { state }
                callback = { () => reblogCallback(state, setState) } />

            <PostActionJsx
                field = "downloaded"
                pack = { icons.download }
                state = { state }
                callback = { () => downloadCallback(state, setState) } />
        </View>
    )
}

const styles = {
    flexContainer: {
        display: "flex",
        flexDirection: "row",
        padding: Dimensions.get("window").width / 40
    },
    icon: {
        width: 30,
        height: 30,
        marginRight: Dimensions.get("window").width / 20
    }
}

export default PostActionBarJsx;