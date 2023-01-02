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
import Icon from "src/components/icons.js";

const SCREEN_WIDTH = Dimensions.get("window").width;

const ModerateMenu = (props) => {
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
                    <Icon name = "ellipsis"/>
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

export { ModerateMenu as default };
