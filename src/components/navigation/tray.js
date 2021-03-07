import React from "react";
import { Image } from "react-native";
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
                        pack = { icons.profile }
                        active = { props.active }
                        nav = { nav } />
            </View>
        </View>
    );
};

const iconSize = 30;

const styles = {
    tray: {
        width: "100%",
        paddingTop: iconSize / 2,
        paddingBottom: iconSize / 2,

        borderTop: "2px solid #CCC",
        backgroundColor: "white"
    },
    iconList: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",

        margin: 0,
        paddingLeft: 0,

        listStyle: "none",
    },
    icon: {
        width: iconSize,
        height: iconSize
    }
};

export default TrayJsx;