import React, { useState, useEffect } from "react";
import {
    Image,
    Text,
    View,
    Dimensions,
    TouchableOpacity
} from "react-native";

const PostAction = (props) => {
    return (
        <TouchableOpacity
              onPress = { props.onPress }>
            <View style = { { marginLeft: SCREEN_WIDTH / 20 } }>
                <FontAwesome
                    name = { props.icon }
                    size = { 24 }
                    focused = { props.active }/>
            </View>
        </TouchableOpacity>
    )
}

const PostActionBar = (props) => {
    return (
        <View style = { styles.flexContainer }>
            <PostAction
                icon = { "heart" }
                active = { props.favourited }
                onPress = { props.onFavourite } />

            <PostAction
                icon = { "boost" }
                active = { props.reblogged }
                onPress = { props.onReblog }/>

            <PostAction
                icon = { "bookmark" }
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

export default PostActionBar;
