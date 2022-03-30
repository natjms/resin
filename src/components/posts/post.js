import React, { useEffect, useState } from "react";
import {
    Image,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    ScrollView,
} from "react-native";

import {
    pluralize,
    timeToAge,
    getAutoHeight,
} from "src/interface/rendering";

import HTML from "react-native-render-html";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as requests from "src/requests";
import { withLeadingAcct } from "src/interface/rendering";

import PostActionBarJsx from "src/components/posts/post-action-bar";

import { MenuOption } from "react-native-popup-menu";
import ContextMenuJsx from "src/components/context-menu.js";

const SCREEN_WIDTH = Dimensions.get("window").width;
const TEST_IMAGE = "https://cache.desktopnexus.com/thumbseg/2255/2255124-bigthumbnail.jpg";

function getDimensionsPromises(uris) {
    return uris.map(attachment => new Promise(resolve => {
        Image.getSize(attachment.url, (width, height) => {
            const autoHeight = getAutoHeight(width, height, SCREEN_WIDTH)

            resolve([SCREEN_WIDTH, autoHeight]);
        });
    }));
}

function handleFavouriteFactory(state, setState) {
    return async () => {
        const newStatus = await requests.favouriteStatus(
            state.instance,
            state.data.id,
            state.accessToken
        );

        setState({...state,
            data: newStatus,
        });
    };
}

const PostImageJsx = (props) => {
    return <Image
        source = { { uri: props.uri } }
        style = {
            {
                flex: 1,
                width: SCREEN_WIDTH,
                height: getAutoHeight(props.width, props.height, SCREEN_WIDTH),
            }
        } />
};

export const RawPostJsx = (props) => {
    const repliesCount = props.data.replies_count;

    let commentsText;
    if (repliesCount == 0 || repliesCount == undefined) {
        commentsText = "View comments";
    } else {
        commentsText = "View "
            + repliesCount
            + pluralize(repliesCount, " comment", " comments");
    }

    const _handleProfileButton = () => {
        props.navigation.navigate("ViewProfile", {
            profile: props.data.account,
        });
    };

    return (
        <View>
            <View style = { styles.postHeader }>
                <TouchableOpacity onPress = { _handleProfileButton }>
                <Image
                    style = { styles.pfp }
                    source = { { uri: props.data.account.avatar } } />
                </TouchableOpacity>
                <TouchableOpacity onPress = { _handleProfileButton }>
                <Text style = { styles.postHeaderName }>
                    { props.data.account.acct }
                </Text>
                </TouchableOpacity>
                <ContextMenuJsx
                      containerStyle = { styles.menu }
                      colour = "#666">
                    { props.own
                        ? <>
                            <MenuOption
                                text = "Delete"
                                onSelect = { props.onDelete } />
                        </>
                        : <>
                            <MenuOption
                                onSelect = { props.onHide }
                                text = "Don't show me their posts"/>
                            <MenuOption
                                onSelect = { props.onMute }
                                text = "Mute" />
                            <MenuOption
                                onSelect = { props.onBlock }
                                text = "Block" />
                        </>
                    }
                </ContextMenuJsx>
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
                reblogged = { props.data.reblogged }
                bookmarked = { props.data.bookmarked }
                onFavourite = { props.onFavourite }
                onReblog = { props.onReblog }
                onBookmark = { props.onBookmark } />
            <View style = { styles.caption }>
                <HTML
                    source = {{
                        html: withLeadingAcct(
                            props.data.account.acct,
                            props.data.content
                        )
                    }}
                    contentWidth = { SCREEN_WIDTH }/>
                <TouchableOpacity
                      onPress = {
                        () => props.navigation.navigate("ViewComments", {
                            originTab: props.navigation.getParam("originTab"),
                            postData: props.data
                        })
                      }>
                    <View>
                        <Text style = { styles.comments }>{ commentsText }</Text>
                    </View>
                </TouchableOpacity>

                <Text style = { styles.captionDate }>
                    { timeToAge(Date.now(), (new Date(props.data.created_at)).getTime()) }
                </Text>
            </View>
        </View>
    );
}

export const PostByDataJsx = (props) => {
    /*
     * Renders a post where the data is supplied directly to the element through
     * its properties, as it is in a timeline.
    */

    let [state, setState] = useState({
        loaded: false,
        deleted: false,
        data: props.data,
        dimensions: []
    });

    useEffect(() => {
        let instance, accessToken, own;
        AsyncStorage
            .multiGet([
                "@user_instance",
                "@user_profile",
                "@user_token",
            ])
            .then(([instancePair, profilePair, tokenPair]) => {
                instance = instancePair[1];
                accessToken = JSON.parse(tokenPair[1]).access_token;
                own = state.data.account.id == JSON.parse(profilePair[1]).id;
            })
            .then(() =>
                Promise.all(
                    getDimensionsPromises(props.data.media_attachments)
                )
            )
            .then(dimensions => {
                setState({...state,
                    dimensions: dimensions,
                    instance,
                    accessToken,
                    own,
                    loaded: true
                });

                if (props.onPostLoaded != null) {
                    props.onPostLoaded();
                }
            });
    }, []);

    const _handleFavourite = async () => {
        let newStatus;

        if (!state.data.favourited) {
            newStatus = await requests.favouriteStatus(
                state.instance,
                state.data.id,
                state.accessToken
            );
        } else {
            newStatus = await requests.unfavouriteStatus(
                state.instance,
                state.data.id,
                state.accessToken
            );
        }

        setState({...state,
            data: newStatus,
        });
    };

    const _handleReblog = async () => {
        let newStatus;

        if (!state.data.reblogged) {
            newStatus = await requests.reblogStatus(
                state.instance,
                state.data.id,
                state.accessToken
            );
        } else {
            newStatus = await requests.unreblogStatus(
                state.instance,
                state.data.id,
                state.accessToken
            );
        }

        setState({...state,
            data: newStatus,
        });
    };

    const _handleBookmark = async () => {
        let newStatus;

        if (!state.data.bookmarked) {
            newStatus = await requests.bookmarkStatus(
                state.instance,
                state.data.id,
                state.accessToken
            );
        } else {
            newStatus = await requests.unbookmarkStatus(
                state.instance,
                state.data.id,
                state.accessToken
            );
        }
        console.warn(newStatus.bookmarked);

        setState({...state,
            data: newStatus,
        });
    };

    const _handleDelete = async () => {
        await requests.deleteStatus(
            state.instance,
            state.data.id,
            state.accessToken
        );

        if (props.afterDelete) {
            // Useful for when we need to navigate away from ViewPost
            props.afterDelete();
        } else {
            setState({...state,
                deleted: true,
            });
        }
    };

    const _handleHide = async () => {
        await requests.muteAccount(
            state.instance,
            state.data.account.id,
            state.accessToken,

            // Thus, only "mute" statuses
            { notifications: false, }
        );

        if (props.afterModerate) {
            props.afterModerate();
        }
    };

    const _handleMute = async () => {
        await requests.muteAccount(
            state.instance,
            state.data.account.id,
            state.accessToken,
        );

        if (props.afterModerate) {
            props.afterModerate();
        }
    };

    const _handleBlock = async () => {
        await requests.blockAccount(
            state.instance,
            state.data.account.id,
            state.accessToken,
        );

        if (props.afterModerate) {
            props.afterModerate();
        }
    };

    return (
        <View>
            { state.loaded && !state.deleted ?
                <RawPostJsx
                    data = { state.data }
                    dimensions = { state.dimensions }
                    onFavourite = { _handleFavourite }
                    onReblog = { _handleReblog }
                    onBookmark = { _handleDelete }
                    onDelete = { _handleDelete }
                    onHide = { _handleHide }
                    onMute = { _handleMute }
                    onBlock = { _handleBlock }
                    own = { state.own }
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
