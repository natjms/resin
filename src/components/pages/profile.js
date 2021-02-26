import React, { useState, useEffect } from "react";
import { View, Dimensions, Image, Text, TouchableWithoutFeedback } from "react-native";

import { activeOrNot } from "src/interface/interactions"

import GridViewJsx from "src/components/posts/grid-view";
import {
    ScreenWithTrayJsx,
    ScreenWithFullNavigationJsx
} from "src/components/navigation/navigators";

const TEST_IMAGE = "https://cache.desktopnexus.com/thumbseg/2255/2255124-bigthumbnail.jpg";
const TEST_POSTS = [
    {
        id: 1,
        media_attachments: [
            {preview_url: TEST_IMAGE}
        ]
    },
    {
        id: 2,
        media_attachments: [
            {preview_url: TEST_IMAGE}
        ]
    },
    {
        id: 3,
        media_attachments: [
            {preview_url: TEST_IMAGE}
        ]
    },
    {
        id: 4,
        media_attachments: [
            {preview_url: TEST_IMAGE}
        ]
    }
];

const ProfileJsx = ({navigation}) => {
    return (
        <ScreenWithTrayJsx
             active = "Profile"
             navigation = { navigation }
             active = "Profile">
            <ProfileDisplayJsx navigation = { navigation }/>
        </ScreenWithTrayJsx>
    );
};

const ViewProfileJsx = ({navigation}) => {
    return (
        <ScreenWithFullNavigationJsx
            active = { navigation.getParam("originTab") }
            navigation = { navigation }>
            <ProfileDisplayJsx navigation = { navigation } />
        </ScreenWithFullNavigationJsx>
    );
}

const ProfileDisplayJsx = ({navigation}) => {
    const accountName = navigation.getParam("acct", "");
    let [state, setState] = useState({
        avatar: "",
        displayName: "Somebody",
        username: "somebody",
        statusesCount: 0,
        followersCount: 0,
        followingCount: 0,
        note: "Not much here...",
        unread_notifications: false,
        own: false,
        loaded: false
    });

    const notif_pack = {
        active: require("assets/eva-icons/bell-unread.png"),
        inactive: require("assets/eva-icons/bell-black.png")
    }

    useEffect(() => {
        // do something to get the profile based on given account name
        if (!state.loaded) {
            setState({
                avatar: TEST_IMAGE,
                displayName: "Nat🔆",
                username: "njms",
                statusesCount: 334,
                followersCount: "1 jillion",
                followingCount: 7,
                note: "Yeah heart emoji.",
                own: true,
                unread_notifs: false,
                loaded: true
            });
        }
    });

    let profileButton;
    if (state.own) {
        profileButton = (
            <TouchableWithoutFeedback>
                <View style = { styles.button }>
                    <Text style = { styles.buttonText }>Edit profile</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    } else {
        profileButton = (
            <TouchableWithoutFeedback>
                <View style = { styles.button }>
                    <Text style = { styles.buttonText }>Follow</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    return (
        <View>
            <View style = { styles.jumbotron }>
                <View style = { styles.profileHeader }>
                    <Image
                        source = { { uri: state.avatar } }
                        style = { styles.avatar } />
                    <View>
                        <Text 
                            style = { styles.displayName }> 
                            {state.displayName}
                        </Text>
                        <Text><strong> @{state.username} </strong></Text>
                    </View>
                    <TouchableWithoutFeedback>
                        <Image 
                            source = { activeOrNot(state.unread_notifs, notif_pack) }
                            style = { styles.bell } />
                    </TouchableWithoutFeedback>
                </View>
                <Text style = { styles.accountStats }>
                    { state.statusesCount } posts &#8226;&nbsp;
                    { state.followersCount } followers &#8226;&nbsp;
                    { state.followingCount } following
                </Text>
                <Text style = { styles.note }>
                    {state.note}
                </Text>
                {profileButton}
            </View>

            <GridViewJsx 
                posts = { TEST_POSTS }
                openPostCallback = {
                    (id) => {
                        navigation.navigate("ViewPost", {
                            id: id,
                            originTab: "Profile"
                        });
                    }
                } />
        </View>
    );
};

const screen_width = Dimensions.get("screen").width;
const screen_height = Dimensions.get("screen").height;

const styles = {
    jumbotron: {
        padding: screen_width / 20,
    },
    profileHeader: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        
        marginBottom: screen_width / 20
    },
    displayName: {
        fontSize: "1.5em"
    },
    avatar: {
        width: screen_width / 5,
        height: screen_width / 5,

        borderRadius: "100%",
        marginRight: screen_width / 20
    },
    bell: {
        width: screen_width / 12,
        height: screen_width / 12,

        marginLeft: "auto",
        marginRight: screen_width / 15
    },
    accountStats: {
        fontSize: "0.8em",
        fontWeight: "bold"
    },
    note: {
        fontSize: "1em",
        marginTop: 10,
    },
    button: {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#888",
        borderRadius: 5,

        padding: 10,
        marginTop: 10
    },
    buttonText: {
        textAlign: "center"
    }
};

export { ViewProfileJsx, ProfileDisplayJsx };
export default ProfileJsx;