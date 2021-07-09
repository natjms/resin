import React, { useState, useEffect } from "react";
import {
    Image,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { checkUnreadNotifications } from "src/requests";

import { activeOrNot } from "src/interface/interactions"
import { TouchableWithoutFeedback, View } from "react-native";

const TrayButtonJsx = (props) => {
    return (
        <TouchableWithoutFeedback
            onPress={ () => props.nav.navigate(props.where, {}) }>
            <Ionicons
                name = { props.icon }
                color = { activeOrNot(props.active == props.where, {
                        active: "#000",
                        inactive: "#888",
                    })
                }
                size = { 30 } />
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

    return (
        <View style = { styles.tray }>
            <View style = { styles.iconList }>
                    <TrayButtonJsx
                        where = "Feed"
                        icon = { "home-outline" }
                        active = { props.active }
                        nav = { nav } />
                    <TrayButtonJsx
                        where = "Discover"
                        icon = { "search-outline" }
                        active = { props.active }
                        nav = { nav } />
                    <TrayButtonJsx
                        where = "Publish"
                        icon = { "camera-outline" }
                        active = { props.active }
                        nav = { nav } />
                    <TrayButtonJsx
                        where = "Direct"
                        icon = { "mail-outline" }
                        active = { props.active }
                        nav = { nav } />
                    <TrayButtonJsx
                        where = "Profile"
                        icon = { "person-outline" }
                        active = { props.active }
                        nav = { nav } />
            </View>
        </View>
    );
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const styles = {
    tray: {
        width: SCREEN_WIDTH,
        paddingTop: 15,
        paddingBottom: 15,

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
};

export default TrayJsx;
