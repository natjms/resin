import React from "react";
import { Dimensions, View, Image } from "react-native";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers
} from "react-native-popup-menu";

const { SlideInMenu } = renderers;

const SCREEN_WIDTH = Dimensions.get("window").width;

const ModerateMenuJsx = (props) => {
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
    };

    return (
        <View style = { props.containerStyle }>
            <Menu renderer = { SlideInMenu }>
                <MenuTrigger>
                    <Image
                        source = { require("assets/eva-icons/ellipsis.png") }
                        style = { props.triggerStyle }/>
                </MenuTrigger>
                <MenuOptions customStyles = { optionsStyles }>
                    <MenuOption text="Hide" />
                    <MenuOption text="Unfollow" />
                    <MenuOption text="Mute" />
                    <MenuOption text="Block" />
                </MenuOptions>
            </Menu>
        </View>
    );
}

export { ModerateMenuJsx as default };
