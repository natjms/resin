import React, { useEffect, useState } from "react";
import {
    Image,
    View,
    Text,
    Dimensions,
    TouchableWithoutFeedback,
    ScrollView
} from "react-native";

import { pluralize, timeToAge} from "src/interface/rendering"

import PostActionBarJsx from "src/components/posts/post-action-bar";

import ModerateMenuJsx from "src/components/moderate-menu.js";

const SCREEN_WIDTH = Dimensions.get("window").width;
const TEST_IMAGE = "https://cache.desktopnexus.com/thumbseg/2255/2255124-bigthumbnail.jpg";

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

function getDimensionsPromises(uris) {
    return uris.map(attachment => new Promise(resolve => {
        Image.getSize(attachment.url, (width, height) => {
            const autoHeight = getAutoHeight(width, height, SCREEN_WIDTH)

            resolve([SCREEN_WIDTH, autoHeight]);
        });
    }));
}

const PostImageJsx = (props) => {
    return <Image
        source = { { uri: props.uri } }
        style = {
            {
                flex: 1,
                width: SCREEN_WIDTH,
                height: getAutoHeight(props.width, props.height, SCREEN_WIDTH),
                // objectFit: "cover"
            }
        } />
};

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
                    source = { { uri: props.data.account.avatar } } />
                <Text style = { styles.postHeaderName }>
                    { props.data.account.acct }
                </Text>
                <ModerateMenuJsx
                    containerStyle = { styles.menu }
                    triggerStyle = { styles.ellipsis } />
            </View>
            {
                props.data.media_attachments.length > 1 ?
                <ScrollView
                      horizontal = { true }
                      snapToInterval = { SCREEN_WIDTH }
                      decelerationRate = { "fast" }
                      style = { styles.carousel }
                      contentContainerStyle = { styles.carouselContainer }>
                    {
                        props.data.media_attachments
                            .map((attachment, i) => {
                                return (<PostImageJsx
                                    key = { i }
                                    uri = { attachment.url }
                                    width = { props.dimensions[i][0] }
                                    height = { props.dimensions[i][1] } />);
                            })
                    }
                </ScrollView>
                : <PostImageJsx
                    uri = { props.data.media_attachments[0].url }
                    width = { props.dimensions[0][0] }
                    height = { props.dimensions[0][1] } />
            }
            <PostActionBarJsx
                favourited = { props.data.favourited }
                reblogged = { props.data.reblogged } />
            <View style = { styles.caption }>
                <Text>
                    <Text style = { styles.strong }>
                        { props.data.account.username }
                    </Text>
                    &nbsp;{ props.data.content }
                </Text>
                <TouchableWithoutFeedback
                      onPress = {
                        () => props.navigation.navigate("ViewComments", {
                            originTab: props.navigation.getParam("originTab"),
                            postData: props.data
                        })
                      }>
                    <View>
                        <Text style = { styles.comments }>{ commentsText }</Text>
                    </View>
                </TouchableWithoutFeedback>

                <Text style = { styles.captionDate }>
                    { timeToAge(Date.now(), (new Date(props.data.created_at)).getTime()) }
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
        loaded: false,
        dimensions: []
    });

    useEffect(() => {
        Promise.all(getDimensionsPromises(props.data.media_attachments))
              .then(dimensions => {
            setState({
                dimensions: dimensions,
                loaded: true
            });
        });
    }, []);

    return (
        <View>
            { state.loaded ?
                <RawPostJsx
                    data = { props.data }
                    dimensions = { state.dimensions }
                    navigation = { props.navigation }/>
                : <View></View> }
        </View>
    );
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
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
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
        borderRadius: 50
    },
    ellipsis: {
        width: SCREEN_WIDTH / 15,
        height: SCREEN_WIDTH / 15
    },
    photo: {
        flex: 1,
    },
    carousel: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH,
    },
    carouselContainer: {
        display: "flex",
        alignItems: "center"
    },
    caption: {
        padding: SCREEN_WIDTH / 24,
    },
    comments: {
        paddingTop: SCREEN_WIDTH / 50,
        color: "#666",
    },
    captionDate: {
        fontSize: 12,
        color: "#666",
        paddingTop: 10
    },
    strong: {
        fontWeight: 'bold',
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
