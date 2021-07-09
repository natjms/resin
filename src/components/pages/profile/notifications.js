import React, { useState, useEffect } from "react";

import {
    Dimensions,
    View,
    TouchableOpacity,
    Image,
    Text,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { ScreenWithBackBarJsx } from "src/components/navigation/navigators";

const TEST_IMAGE = "https://cache.desktopnexus.com/thumbseg/2255/2255124-bigthumbnail.jpg";
const TEST_NOTIFICATIONS = [
    {
        id: 1,
        type: "follow",
        account: {
            acct: "njms",
            avatar: TEST_IMAGE,
        },
    },
    {
        id: 2,
        type: "follow_request",
        account: {
            acct: "njms",
            avatar: TEST_IMAGE,
        },
    },
    {
        id: 3,
        type: "mention",
        account: {
            acct: "njms",
            avatar: TEST_IMAGE,
        },
        status: {
            id: 1,
            media_attachments: [],
            content: "This is a message",
        }
    },
    {
        id: 4,
        type: "mention",
        account: {
            acct: "njms",
            avatar: TEST_IMAGE,
        },
        status: {
            id: 1,
            media_attachments: [
                { url: TEST_IMAGE }
            ],
            content: "This is a message",
        }
    },
    {
        id: 5,
        type: "mention",
        account: {
            acct: "njms",
            avatar: TEST_IMAGE,
        },
        status: {
            id: 1,
            media_attachments: [
                { url: TEST_IMAGE }
            ],
            content: "This is a really really really really really really"
                + " really really really really really really long message",
        }
    },
    {
        id: 6,
        type: "reblog",
        account: {
            acct: "njms",
            avatar: TEST_IMAGE,
        },
        status: {
            id: 1,
            media_attachments: [
                { url: TEST_IMAGE }
            ],
        }
    },
    {
        id: 7,
        type: "favourite",
        account: {
            acct: "njms",
            avatar: TEST_IMAGE,
        },
        status: {
            id: 1,
            media_attachments: [
                { url: TEST_IMAGE }
            ],
        }
    },
    {
        id: 8,
        type: "status",
        account: {
            acct: "njms",
            avatar: TEST_IMAGE,
        },
        status: {
            id: 1,
            media_attachments: [
                { url: TEST_IMAGE }
            ],
        }
    },
]

function navigateProfileFactory(nav, acct) {
    return () => {
        nav.navigate("ViewProfile", {
            acct: acct,
        });
    };
}

function navigatePostFactory(nav, id) {
    return () => {
        nav.navigate("ViewPost", {
            originTab: "Profile",
            id: id,
        });
    }
}

function renderNotification(notif, navigation) {
    switch(notif.type) {
        case "follow":
            return <FollowJsx
                data = { notif }
                key = { notif.id }
                navigation = { navigation } />
        case "follow_request":
            return <FollowRequestJsx
                data = { notif }
                key = { notif.id }
                navigation = { navigation } />
        case "mention":
            return <MentionJsx
                data = { notif }
                key = { notif.id }
                navigation = { navigation } />
        case "reblog":
            return <ReblogJsx
                data = { notif }
                key = { notif.id }
                navigation = { navigation } />
        case "favourite":
            return <FavouriteJsx
                data = { notif }
                key = { notif.id }
                navigation = { navigation } />
        case "status":
            return <StatusJsx
                data = { notif }
                key = { notif.id }
                navigation = { navigation } />
        default:
            // We're not expecting polls to be super popular on Pixelfed
            return <></>
    }
}

const UserTextJsx = (props) => {
    return (
        <Text
              style = { styles.bold }
              onPress = {
                () => {
                    props.navigation.navigate("ViewProfile", {
                        acct: props.acct
                    });
                }
              }>
            { props.acct }&nbsp;
        </Text>
    );
};

const NotificationJsx = (props) => {
    return (
        <View style = { styles.notif.container }>
            <View style = { styles.notif.thumbnailContainer }>
                <TouchableOpacity
                      onPress = { props.thumbnailPressCallback }>
                    <Image
                        style = {
                            [
                                styles.notif.thumbnail,
                                props.thumbnailStyles
                            ]
                        }
                        source = { { uri: props.thumbnail } } />
                </TouchableOpacity>
            </View>
            <View style = { styles.notif.contentContainer }>
                { props.children }
            </View>
            { props.button ?
                <View style = { styles.notif.buttonContainer }>
                   <TouchableOpacity
                          style = { styles.notif.button }
                          onPress = { props.buttonCallback }>
                        <Text>{ props.buttonLabel }</Text>
                    </TouchableOpacity>
                </View>
                : <></>
            }
        </View>
    );
};

const FollowJsx = (props) => {
    return (
        <NotificationJsx
              thumbnail = { props.data.account.avatar }
              thumbnailStyles = { styles.notif.circularThumbnail }
              thumbnailPressCallback = {
                navigateProfileFactory(props.navigation, props.data.account.acct)
              }>
            <Text style = { styles.notif.content }>
                <UserTextJsx acct = { props.data.account.acct } />
                has followed you.
            </Text>
        </NotificationJsx>
    );
};

const FollowRequestJsx = (props) => {
    return (
        <NotificationJsx
              thumbnail = { props.data.account.avatar }
              thumbnailStyles = { styles.notif.circularThumbnail }
              thumbnailPressCallback = {
                navigateProfileFactory(props.navigation, props.data.account.acct)
              }
              button = { true }
              buttonLabel = { "Accept" }
              buttonCallback = { () => console.log("Request accepted") }>
            <Text style = { styles.notif.content }>
                <UserTextJsx acct = { props.data.account.acct } />
                has requested to follow you.
            </Text>
        </NotificationJsx>
    );
};

const MentionJsx = (props) => {
    let uri;
    let imageStyle;
    let thumbnailCallback;

    if (props.data.status.media_attachments.length > 0) {
        // If it's a comment...
        uri = props.data.status.media_attachments[0].url;
        imageStyle = {};
        thumbnailCallback = navigatePostFactory(
            props.navigation,
            props.data.status.id
        );
    } else {
        // If it's a reply to your comment...
        uri = props.data.account.avatar;
        imageStyle = styles.notif.circularThumbnail;
        thumbnailCallback = navigateProfileFactory(
            props.navigation,
            props.data.account.acct
        );
    }

    return (
        <NotificationJsx
              thumbnail = { uri }
              thumbnailStyles = { imageStyle }i
              thumbnailPressCallback = { thumbnailCallback }>
            <Text style = { styles.notif.content }>
                <UserTextJsx acct = { props.data.account.acct } />
                mentioned you:
                <Text style = { styles.notif.status }>
                   "{ props.data.status.content }"
                </Text>
            </Text>
        </NotificationJsx>
    );
};

const ReblogJsx = (props) => {
    return (
        <NotificationJsx
              thumbnail = { props.data.status.media_attachments[0].url }
              thumbnailPressCallback = {
                navigatePostFactory(props.navigation, props.data.status.id)
              }>
            <FontAwesome
                name = "retweet"
                color = "#000"
                size = { 20 }
                style = { styles.notif.inlineIcon }/>
            <Text style = { styles.notif.content }>
                <UserTextJsx acct = { props.data.account.acct } />
                shared your post.
            </Text>
        </NotificationJsx>
    );
};

const FavouriteJsx = (props) => {
    return (
        <NotificationJsx
              thumbnail = { props.data.status.media_attachments[0].url }
              thumbnailPressCallback = {
                navigatePostFactory(props.navigation, props.data.status.id)
              }>
            <FontAwesome
                name = "heart"
                size = { 20 }
                color = "black"
                style = { styles.notif.inlineIcon }/>
            <Text style = { styles.notif.content }>
                <UserTextJsx acct = { props.data.account.acct } />
                liked your post.
            </Text>
        </NotificationJsx>
    );
};

const StatusJsx = (props) => {
    return (
        <NotificationJsx
              thumbnail = { props.data.status.media_attachments[0].url }
              thumbnailPressCallback = {
                navigatePostFactory(props.navigation, props.data.status.id)
              }>
            <Text style = { styles.notif.content }>
                <UserTextJsx acct = { props.data.account.acct } />
                just posted.
            </Text>
        </NotificationJsx>
    );
};

const NotificationsJsx = ({navigation}) => {
    const [state, setState] = useState({
        loaded: false,
    });

    useEffect(() => {
        const read = JSON.stringify({
            unread: false,
            memory: [
                { id: 1 },
                { id: 2 },
                { id: 3 },
            ]
        });

        AsyncStorage.mergeItem("@user_notifications", read)
            .then(() => {
                setState({...state,
                    notifications: TEST_NOTIFICATIONS,
                    loaded: true
                })
            });

    }, []);

    return (
        <ScreenWithBackBarJsx
              navigation = { navigation }>
            { state.loaded ?
                <View>
                    {
                        state.notifications.map(notif =>
                            renderNotification(notif, navigation)
                        )
                    }
                </View>
                : <></>
            }
        </ScreenWithBackBarJsx>
    );
}

const SCREEN_WIDTH = Dimensions.get("window").width;

const styles = {
    notif: {
        container: {
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 20,
            marginTop: 10,
            marginBottom: 10,
        },

        circularThumbnail: { borderRadius: SCREEN_WIDTH / 16 },
        thumbnailContainer: {
            marginRight: 10,
        },
        thumbnail: {
            width: SCREEN_WIDTH / 8,
            height: SCREEN_WIDTH / 8,
        },

        contentContainer: {
            flexShrink: 1,
            flexDirection: "row",
            alignItems: "center",
        },
        inlineIcon: {
            marginRight: 10,
        },
        status: { fontStyle: "italic" },

        buttonContainer: {
            marginLeft: "auto",
            marginRight: 10,
        },
        button: {
            borderWidth: 1,
            borderColor: "#888",
            borderRadius: 10,
            padding: 10,
        },
    },
    bold: { fontWeight: "bold" },
};

export default NotificationsJsx;
