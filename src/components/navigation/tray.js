import React, { useState, useEffect } from "react";
import {
    Image,
    Dimensions,
} from "react-native";

import { checkUnreadNotifications } from "src/requests";

import { activeOrNot } from "src/interface/interactions"
import { TouchableWithoutFeedback, View } from "react-native";

const TrayButtonJsx = (props) => {
    return (
        <TouchableWithoutFeedback
            onPress={ () => props.nav.navigate(props.where, {}) }>
            <Image
                source = {
                    activeOrNot(props.active == props.where, props.pack)
                }
                style = { styles.icon } />
        </TouchableWithoutFeedback>
    );
}

const TrayJsx = (props) => {
    const nav = props.navigation;
    const [state, setState] = useState({
        unreadNotifications: false
    });

    useEffect(() => {
        checkUnreadNotifications()
            .then(isUnread => {
                setState({...state,
                    unreadNotifications: isUnread,
                });
            });
    }, []);


    const icons = {
        feed: {
            active: require("assets/eva-icons/home-black.png"),
            inactive: require("assets/eva-icons/home-grey.png")
        },
        discover: {
            active: require("assets/eva-icons/search-black.png"),
            inactive: require("assets/eva-icons/search-grey.png")
        },
        publish: {
            active: require("assets/eva-icons/camera-black.png"),
            inactive: require("assets/eva-icons/camera-grey.png")
        },
        direct: {
            active: require("assets/eva-icons/email-black.png"),
            inactive: require("assets/eva-icons/email-grey.png")
        },
        profile: {
            active: require("assets/eva-icons/person-black.png"),
            inactive: require("assets/eva-icons/person-grey.png")
        },
        profileNotif: {
            active: require("assets/eva-icons/person-black-notif.png"),
            inactive: require("assets/eva-icons/person-grey-notif.png")
        },
    }

    return (
        <View style = { styles.tray }>
            <View style = { styles.iconList }>
                    <TrayButtonJsx
                        where = "Feed"
                        pack = { icons.feed }
                        active = { props.active }
                        nav = { nav } />
                    <TrayButtonJsx
                        where = "Discover"
                        pack = { icons.discover }
                        active = { props.active }
                        nav = { nav } />
                    <TrayButtonJsx
                        where = "Publish"
                        pack = { icons.publish }
                        active = { props.active }
                        nav = { nav } />
                    <TrayButtonJsx
                        where = "Direct"
                        pack = { icons.direct }
                        active = { props.active }
                        nav = { nav } />
                    <TrayButtonJsx
                        where = "Profile"
                        pack = {
                            state.unreadNotifications ?
                                icons.profileNotif
                                : icons.profile
                        }
                        active = { props.active }
                        nav = { nav } />
            </View>
        </View>
    );
};

const iconSize = 30;

const SCREEN_WIDTH = Dimensions.get("window").width;
const styles = {
    tray: {
        width: SCREEN_WIDTH,
        paddingTop: iconSize / 2,
        paddingBottom: iconSize / 2,

        borderTopWidth: 2,
        borderTopColor: "#CCC",
        backgroundColor: "white"
    },
    iconList: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",

        margin: 0,
        paddingLeft: 0,
    },
    icon: {
        width: iconSize,
        height: iconSize
    }
};

export default TrayJsx;
