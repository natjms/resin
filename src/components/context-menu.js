import React from "react";
import { Dimensions, View, Image } from "react-native";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers
} from "react-native-popup-menu";

import Icon from "src/components/icons.js";

const { SlideInMenu } = renderers;

const SCREEN_WIDTH = Dimensions.get("window").width;

const ContextMenu = (props) => {
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
                    <Icon name = "ellipsis"
                        size = { props.size ? props.size : 24 }/>
                </MenuTrigger>
                <MenuOptions customStyles = { optionsStyles }>
                    { props.children }
                </MenuOptions>
            </Menu>
        </View>
    );
}

export { ContextMenu as default };
