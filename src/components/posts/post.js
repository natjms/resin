import React, { useEffect, useState } from "react";
import { Image, View, Text, Dimensions, TouchableWithoutFeedback } from "react-native";

import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers
} from "react-native-popup-menu";

import PostActionBarJsx from "src/components/posts/post-action-bar";

const SCREEN_WIDTH = Dimensions.get("window").width;
const TEST_IMAGE = "https://cache.desktopnexus.com/thumbseg/2255/2255124-bigthumbnail.jpg";

// Extract the SlideInMenu function from `renderers`
// This will be used in RawPostJsx
const { SlideInMenu } = renderers;

function pluralize(n, singular, plural) {
    if (n < 2) {
        return singular;
    } else {
        return plural;
    }
}

function getAutoHeight(w1, h1, w2) {
    /*
    Given the original dimensions and the new width, calculate what would
    otherwise be the "auto" height of the image.

    Just so that nobody has to ever work out this algebra again:

    Let {w1, h1} = the width and height of the static image,
        w2 = the new width,
        h2 = the "auto" height of the scaled image of width w2:

        w1/h1 = w2/h2
        h2 * w1/h1 = w2
        h2 = w2 / w1/h1
        h2 = w2 * h1/w1
    */
    return w2 * (h1 / w1)
}

function timeToAge(time1, time2) {
    /*
    Output a friendly string to describe the age of a post, where `time1` and
    `time2` are in milliseconds
    */

    const between = (n, lower, upper) => n >= lower && n < upper;

    const diff = time1 - time2;

    if (diff < 60000) {
        return "Seconds ago"
    } else if (between(diff, 60000, 3600000)) {
        const nMin = Math.floor(diff / 60000);
        return nMin + " " + pluralize(nMin, "minute", "minutes") + " ago";
    } else if (between(diff, 3600000, 86400000)) {
        const nHours = Math.floor(diff / 3600000);
        return nHours + " " + pluralize(nHours, "hour", "hours") + " ago";
    } else if (between(diff, 86400000, 2629800000)) {
        const nDays = Math.floor(diff / 86400000);
        return nDays + " " + pluralize(nDays, "day", "days") + " ago";
    } else if (between(diff, 2629800000, 31557600000)) {
        const nMonths = Math.floor(diff / 2629800000);
        return nMonths + " " + pluralize(nMonths, "month", "months") + " ago";
    } else {
        const nYears = Math.floor(diff / 31557600000);
        return nYears + " " + pluralize(nYears, "year", "years") + " ago";
    }
}

export const RawPostJsx = (props) => {
    const repliesCount = props.data.replies_count;

    let commentsText;
    if (repliesCount == 0) {
        commentsText = "View comments";
    } else {
        commentsText = "View "
            + repliesCount
            + pluralize(repliesCount, " comment", " comments");
    }

    return (
        <View>
            <View style = { styles.postHeader }>
                <Image
                    style = { styles.pfp }
                    source = { { uri: props.data.avatar } } />
                <Text
                    style = { styles.postHeaderName }>{ props.data.username }</Text>
                <View style = { styles.menu }>
                    <Menu renderer = { SlideInMenu }>
                        <MenuTrigger>
                            <Image
                                source = { require("assets/eva-icons/ellipsis.png") }
                                style = { styles.ellipsis }/>
                        </MenuTrigger>
                        <MenuOptions customStyles = { optionsStyles }>
                            <MenuOption text="Hide" />
                            <MenuOption text="Unfollow" />
                            <MenuOption text="Block" />
                        </MenuOptions>
                    </Menu>
                </View>
            </View>
            { /* TODO: support for more than one image per post */ }
            <Image
                source = { { uri: TEST_IMAGE/* props.data.media_attachments[0] */ } }
                style = { {
                    flex: 1,
                    width: SCREEN_WIDTH,
                    height: getAutoHeight(props.width, props.height, SCREEN_WIDTH)
                } } />
            <PostActionBarJsx
                favourited = { props.data.favourited }
                reblogged = {props.data.reblogged } />
            <View style = { styles.caption }>
                <Text>
                    <strong>{ props.data.username }</strong>&nbsp;{ props.data.content }
                </Text>
                <TouchableWithoutFeedback>
                    <View>
                        <Text style = { styles.comments }>{ commentsText }</Text>
                    </View>
                </TouchableWithoutFeedback>

                <Text style = { styles.captionDate }>
                    { timeToAge((new Date()).getTime(), props.data.timestamp) }
                </Text>
            </View>
        </View>
    );
}

export const PostByDataJsx = (props) => {
    /*
    Renders a post where the data is supplied directly to the element through
    its properties, as it is in a timeline.
    */

    let [state, setState] = useState({
        width: 0,
        height: 0,
        loaded: false
    });

    useEffect(() => {
        Image.getSize(TEST_IMAGE, (width, height) => {
            const newHeight = getAutoHeight(width, height, SCREEN_WIDTH)

            setState({
                width: SCREEN_WIDTH,
                height: newHeight,
                loaded: true
            });
        });
    });

    return (
        <View>
            { state.loaded ?
                <RawPostJsx
                    data = { props.data }
                    width = { state.width }
                    height = { state.height } />
                : <View></View> }
        </View>
    );
}

export const PostByIdJsx = (props) => {
    /*
    Renders a post given the post's ID in the properties, as is done when
    retrieving an individual post on someone's profile.
    */
    let [state, setState] = useState({
        avatar: "",
        username: "",
        media_attachments: [],
        favourited: false,
        reblogged: false,
        content: "",
        timestamp: 0,
    });

    useEffect(() => {
        // TODO: Make API request using props.id, set it as the state
        ((/* This would be the data retrieved */) => {
            Image.getSize(TEST_IMAGE, (width, height) => {
                const newHeight = getAutoHeight(width, height, SCREEN_WIDTH)

                setState({
                    avatar: TEST_IMAGE,
                    username: "njms",
                    media_attachments: [TEST_IMAGE],
                    favourited: false,
                    reblogged: false,
                    content: "Also learning Claire de Lune feels a lot like reading the communist manifesto",
                    timestamp: 1596745156000,
                    width: SCREEN_WIDTH,
                    height: newHeight,
                    loaded: true
                });
            });
        })();
    });

    return (
        <View>
            { state.loaded ?
                <RawPostJsx
                    data = { state }
                    width = { state.width }
                    height = { state.height } />
                : <View></View>
            }
        </View>
    )
}

const styles = {
    postHeader: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginTop: SCREEN_WIDTH / 28,
        marginBottom: SCREEN_WIDTH / 28,
        marginLeft: SCREEN_WIDTH / 36,
        marginRight: SCREEN_WIDTH / 36
    },
    postHeaderName: {
        fontSize: "1em",
        fontWeight: "bold",
        marginTop: -2
    },
    menu: {
        marginLeft: "auto",
        marginRight: SCREEN_WIDTH / 30
    },
    pfp: {
        width: SCREEN_WIDTH / 10,
        height: SCREEN_WIDTH / 10,
        marginRight: SCREEN_WIDTH / 28,
        borderRadius: "100%"
    },
    ellipsis: {
        width: SCREEN_WIDTH / 15,
        height: SCREEN_WIDTH / 15
    },
    photo: {
        flex: 1,
    },

    caption: {
        padding: SCREEN_WIDTH / 24,
    },
    comments: {
        paddingTop: SCREEN_WIDTH / 50,
        color: "#666",
    },
    captionDate: {
        fontSize: "0.8em",
        color: "#666",
    }
};

// customStyles for react-native-popup-menu should be defined in particular
// objects to be interpreted correctly.

//const menuStyles = {
//    menuProviderWrapper
//}

const optionsStyles = {
    optionWrapper: { // The wrapper around a single option
        paddingLeft: SCREEN_WIDTH / 15,
        paddingTop: SCREEN_WIDTH / 30,
        paddingBottom: SCREEN_WIDTH / 30
    },
    optionsWrapper: { // The wrapper around all options
        marginTop: SCREEN_WIDTH / 20,
        marginBottom: SCREEN_WIDTH / 20,
    },
    optionsContainer: { // The Animated.View
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    }
}
