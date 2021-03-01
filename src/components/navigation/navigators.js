import React from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { MenuProvider } from "react-native-popup-menu";

import BackBarJsx from "./back-bar";
import TrayJsx from "src/components/navigation/tray";

// Provider for context menus
// Allows for establishing global styling of context menus
const ContextJsx = (props) => {
    return (
        <MenuProvider customStyles = { providerStyles }>
            { props.children }
        </MenuProvider>
    );
};

export const ScreenWithTrayJsx = (props) => {
    return (
        <ContextJsx>
            <View style = { { flex: 1 } }>
                <ScrollView>
                    { props.children }
            </ScrollView>
            <TrayJsx
                    active = { props.active }
                    navigation = { props.navigation } />
            </View>
        </ContextJsx>
    );
};

export const ScreenWithBackBarJsx = (props) => {
    return (
        <ContextJsx>
            <View style = { { flex: 1 } }>
                <BackBarJsx navigation = { props.navigation } />
                <ScrollView>
                    { props.children }
                </ScrollView>
            </View>
        </ContextJsx>
    );
};

export const ScreenWithFullNavigationJsx = (props) => {
    return (
        <ContextJsx>
            <View style = { { flex: 1 } }>
                <BackBarJsx navigation = { props.navigation } />
                <ScrollView>
                    { props.children }
                </ScrollView>
                <TrayJsx
                    active = { props.active }
                    navigation = { props.navigation } />
            </View>
        </ContextJsx>
    );
};

const providerStyles = {
    backdrop: {
        backgroundColor: "black",
        opacity: 0.5
    }
}
