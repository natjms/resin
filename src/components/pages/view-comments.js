import React, { useEffect, useState } from "react";
import {
    Dimensions,
    View,
    SafeAreaView,
    Image,
    TextInput,
    Text
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HTML from "react-native-render-html";
import {
    withLeadingAcct,
    timeToAge,
    StatusBarSpace
} from "src/interface/rendering";
import { activeOrNot } from "src/interface/interactions";

import TimelineViewJsx from "src/components/posts/timeline-view";
import BackBarJsx from "src/components/navigation/back-bar";
import { TouchableOpacity } from "react-native-gesture-handler";

import * as requests from "src/requests";

import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers
} from "react-native-popup-menu";

const { SlideInMenu } = renderers;

function chunkWhile(arr, fun) {
    /*
     * Chunk a list into partitions while fun returns something truthy
     * > chunkWhile([1,1,1,2,2], (a, b) => a == b)
     * [[1,1,1], [2,2]]
     */

    let parts;

    if (arr == []) {
        return []
    } else {
        parts = [[arr[0]]];
    }

    let tail = arr.slice(1);

    if (tail == []) {
        return parts;
    }

    for (let i = 0; i < tail.length; i++) {
        let lastPart = parts[parts.length - 1];
        if (fun(tail[i], lastPart[lastPart.length - 1])) {
            // If fun returns something truthy, push tail[i] to the end of the
            // partition at the end of the new array.
            parts[parts.length - 1].push(tail[i])
        } else {
            // Create a new partition starting with tail[i]
            parts.push([tail[i]])
        }
    }

    return parts;
}

function threadify(descendants) {
    /*
     * Take a list of descendants and sort them into a 2D matrix.
     * The first item is the direct descendant of parentID post and the rest
     * are all the descendants of the direct descendant in order of id, the
     * way Instagram displays conversations in comments.
     * i.e. [[first level comment, ...descendants]]
     */
    if (descendants.length == 0) {
        return [];
    }

    // Sort comments in order of increasing reply id
    const comments = descendants.sort((first, second) => {
        return first.in_reply_to_id - second.in_reply_to_id;
    });

    // Return partitions of comments based on their reply id
    const byReply = chunkWhile(comments, (a, b) => {
        return a.in_reply_to_id == b.in_reply_to_id;
    });

    // Start with just the first level comments.
    // All these elements should be in singleton arrays so they can be
    // appended to.
    let sorted = byReply[0].map(x => [x]);

    let sub = byReply.slice(1); // All sub-comments

    // Repeat the procedure until sub is empty (i.e all comments have been
    // sorted)
    while (sub.length > 0) {
        sorted.forEach((thread, threadIndex) => {
            for (let i = 0; i < thread.length; i++) {
                const id = thread[i].id;

                // Search for comment groups with that id
                for(let subIndex = 0; subIndex < sub.length; subIndex++) {
                    // All items in each partition should have the same reply id
                    if(id == sub[subIndex][0].in_reply_to_id) {
                        // Move the newly found thread contents to thread in
                        // sorted
                        sorted[threadIndex] = sorted[threadIndex].concat(sub[subIndex]);
                        sub.splice(subIndex, 1);
                    }
                }
            }
        });
    }

    return sorted;
}

const CommentJsx = (props) => {
    const menuOptionsStyles = {
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
    };

    const packs = {
        favourited: {
            active: "heart",
            inactive: "heart-outline",
        }
    };

    return (
        <View style = { styles.container }>
            <Image
                source = { { uri: props.data.account.avatar } }
                style = { styles.avatar } />
            <View style = { styles.contentContainer }>
                <Text style = { styles.content }>
                    <HTML
                        source = {{
                            html: withLeadingAcct(
                                props.data.account.acct,
                                props.data.content
                            )
                        }}
                        contentWidth = { SCREEN_WIDTH }/>
                </Text>
                <View style = { styles.commentActions }>
                    <View>
                        <Text style = { styles.actionText }>
                            {
                                timeToAge(
                                    Date.now(),
                                    (new Date(props.data.created_at)).getTime()
                                )
                            }
                        </Text>
                    </View>
                    <TouchableOpacity
                          onPress = {
                              props.onReply(
                                  props.data.account.acct,
                                  props.data.id
                              )
                          }>
                        <View>
                            <Text style = { [styles.actionText] }>
                                Reply
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                          onPress = { props.onFavourite(props.data) }>
                        <Ionicons
                            name = { activeOrNot(props.data.favourited, packs.favourited) }
                            size = { 15 }
                            style = { styles.action }/>
                    </TouchableOpacity>
                    <View style = { { paddingLeft: 10, } }>
                        <Menu renderer = { SlideInMenu }>
                            <MenuTrigger>
                                <Ionicons
                                    name="ellipsis-horizontal"
                                    size={18}
                                    color="#666" />
                            </MenuTrigger>
                            <MenuOptions customStyles = { menuOptionsStyles }>
                                { props.profile.acct == props.data.account.acct
                                    ? <>
                                        <MenuOption
                                            onSelect = { props.onDelete(props.data) }
                                            text = "Delete" />
                                    </>
                                    : <>
                                        <MenuOption text = "Report" />
                                        <MenuOption text = "Mute" />
                                        <MenuOption text = "Block" />
                                    </>
                                }
                            </MenuOptions>
                        </Menu>
                    </View>
                </View>
            </View>
        </View>
    );
}

const ViewCommentsJsx = (props) => {
    let [state, setState] = useState({
        postData: props.navigation.getParam("postData", null),
        loaded: false,
        reply: "",
    });

    useEffect(() => {
        let profile, instance, accessToken;
        AsyncStorage
            .multiGet([
                "@user_profile",
                "@user_instance",
                "@user_token",
            ]).then(([profilePair, instancePair, tokenPair]) => {
                profile = JSON.parse(profilePair[1]);
                instance = instancePair[1];
                accessToken = JSON.parse(tokenPair[1]).access_token;

                return requests
                    .fetchStatusContext(instance, state.postData.id, accessToken)
            })
            .then(context => {
                setState({...state,
                    descendants: threadify(context.descendants),
                    profile,
                    instance,
                    accessToken,
                    inReplyTo: {
                        acct: state.postData.account.acct,
                        id: state.postData.id,
                    },
                    loaded: true,
                });
            });
    }, []);

    const _fetchNewThreads = async () => {
        // Fetch an updated context to rerender the page
        const { descendants } = await requests.fetchStatusContext(
            state.instance,
            state.postData.id,
            state.accessToken,
        );

        return threadify(descendants);
    }

    const _onReplyFactory = (acct, id) => {
        return () => {
            setState({...state,
                inReplyTo: {
                    acct,
                    id,
                },
            });
        }
    };

    const _onFavouriteFactory = (data) => {
        return async () => {
            if(!data.favourited) {
                await requests.favouriteStatus(
                    state.instance,
                    data.id,
                    state.accessToken
                )
            } else {
                await requests.unfavouriteStatus(
                    state.instance,
                    data.id,
                    state.accessToken
                )
            }

            setState({...state,
                descendants: await _fetchNewThreads(),
            });
        }
    }

    const _onDeleteFactory = data => {
        return async () => {
            await requests.deleteStatus(
                state.instance,
                data.id,
                state.accessToken,
            );

            // It appears that it takes a moment for the Context of a
            // post to register that a comment has been deleted, so instead
            // of waiting for it, it's more efficient to just drop the comment
            // on the client side.
            const newThreads = state.descendants.map(thread =>
                thread.filter(comment => comment.id != data.id)
            ).filter(thread => thread.length > 0);

            setState({...state,
                descendants: newThreads,
            });
        };
    };

    const _handleCancelSubReply = () => {
        setState({...state,
            inReplyTo: {
                acct: state.postData.account.acct,
                id: state.postData.id,
            },
        });
    };

    const _handleSubmitReply = async () => {
        if(state.reply.length > 0) {
            await requests.publishStatus(
                state.instance,
                state.accessToken,
                {
                    status: state.reply,
                    in_reply_to_id: state.inReplyTo.id,
                }
            );

            setState({...state,
                // Reset the comment form
                inReplyTo: {
                    acct: state.postData.account.acct,
                    id: state.postData.id,
                },
                reply: "",

                // Retrieve updated context
                descendants: await _fetchNewThreads(),
            });
        }
    };

    const PartialComment = (props) => (
        <CommentJsx
            { ...props }
            profile = { state.profile }
            onFavourite = { _onFavouriteFactory }
            onReply = { _onReplyFactory }
            onDelete = { _onDeleteFactory } />
    );

    return (
        <>
            { state.loaded ?
                <SafeAreaView style = { { flex: 1 } }>
                    <StatusBarSpace color = "white"/>
                    <BackBarJsx navigation = { props.navigation }/>
                    <ScrollView>
                        { state.loaded
                            ? <View>
                                <View style = { styles.parentPost }>
                                    <PartialComment
                                        data = { state.postData } />
                                </View>
                                <View>
                                    { state.descendants.length != 0
                                        ? state.descendants.map((thread, i) => {
                                            const comment = thread[0];
                                            const subs = thread.slice(1);
                                            return (
                                                <View key = { i }>
                                                    <PartialComment
                                                        data = { comment }/>
                                                    {
                                                        subs.map((sub, j) => {
                                                            return (
                                                                <View
                                                                      key = { j }
                                                                      style = { styles.sub }>
                                                                    <PartialComment
                                                                        data = { sub }/>
                                                                </View>
                                                            )
                                                        })
                                                    }
                                                </View>
                                            );
                                        })
                                        : <View style = { styles.emptyMessage.container }>
                                            <Text style = { styles.emptyMessage.text }>
                                                No comments
                                            </Text>
                                        </View>
                                    }
                                </View>
                            </View>
                            : <></>
                        }
                    </ScrollView>
                    <View style = { styles.form.container }>
                        <>
                            { state.inReplyTo.id != state.postData.id
                                ? <TouchableOpacity onPress = { _handleCancelSubReply }>
                                    <View style = { styles.form.inReplyTo.container }>
                                        <Ionicons name="close" size={24} color="#666" />
                                        <Text style = { styles.form.inReplyTo.message }>
                                            &nbsp;Replying to&nbsp;
                                            <Text style = { styles.bold }>
                                                { state.inReplyTo.acct }
                                            </Text>...
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                : <></>
                            }
                        </>
                        <View style = { styles.commentForm }>
                            <Image
                                style = { styles.avatar }
                                source = { { uri: state.profile.avatar } }/>
                            <TextInput
                                style = { styles.commentInput }
                                placeholder = "Say something..."
                                multiline = { true }
                                value = { state.reply }
                                onChangeText = { c => setState({...state, reply: c }) }/>
                            <View style = { styles.submitContainer }>
                                <TouchableOpacity onPress = { _handleSubmitReply }>
                                    <Ionicons
                                        name = "paper-plane-outline"
                                        color = "black"
                                        size = { 30 }/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
                : <></>
            }
        </>
    );
}

const SCREEN_WIDTH = Dimensions.get("window").width;

const styles = {
    bold: {
        fontWeight: "bold",
    },
    container: {
        flexDirection: "row",
        flexShrink: 1,
        marginTop: 10,
        marginBottom: 10,
        marginRight: 20,
    },
    avatar: {
        marginLeft: 20,
        marginRight: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    contentContainer: {
        flexShrink: 1
    },
    parentPost: {
        borderBottomWidth: 1,
        borderBottomColor: "#CCC",
        marginBottom: 10,
    },
    sub: {
        marginLeft: SCREEN_WIDTH / 8,
    },
    commentActions: {
        flexDirection: "row",
        alignItems: "center",
    },
    actionText: {
        fontSize: 13,
        color: "#666",
        paddingRight: 10,
    },
    heart: {
        width: 15,
        height: 15,
    },

    form: {
        container: {
            backgroundColor: "white",

            borderTopWidth: 1,
            borderTopColor: "#CCC",
        },
        inReplyTo: {
            container: {
                padding: 10,
                flexDirection: "row",
                alignItems: "center",
            },
            message: {
                color: "#666",
            },
        },
    },

    commentForm: {
        flexDirection: "row",
        alignItems: "center",

        paddingTop: 10,
        paddingBottom: 10,
    },
    commentInput: {
        borderWidth: 0,
        padding: 10,
        flexGrow: 3,
        marginRight: 20,
    },
    submitContainer: {
        marginLeft: "auto",
        marginRight: 20,
    },
    commentSubmit: {
        width: 30,
        height: 30,
    },
    emptyMessage: {
        container: {
            paddingTop: 30,
            paddingBottom: 30,
        },
        text: {
            textAlign: "center",
            color: "#666",
        },
    },
};

export default ViewCommentsJsx;
