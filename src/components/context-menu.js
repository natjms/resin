import React from "react";
import { Dimensions, View, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers
} from "react-native-popup-menu";

const { SlideInMenu } = renderers;

const SCREEN_WIDTH = Dimensions.get("window").width;

const ContextMenuJsx = (props) => {
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
                    <Ionicons
                        name = "ellipsis-horizontal"
                        size = { props.size ? props.size : 24 }
                        color = { props.colour ? props.colour : "#666" } />
                </MenuTrigger>
                <MenuOptions customStyles = { optionsStyles }>
                    { props.children }
                </MenuOptions>
            </Menu>
        </View>
    );
}

export { ContextMenuJsx as default };
