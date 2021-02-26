import React from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import BackBarJsx from "./back-bar";
import TrayJsx from "src/components/navigation/tray";

export const ScreenWithTrayJsx = (props) => {
    return (
        <View style = { { flex: 1 } }>
            <ScrollView>
                { props.children }
            </ScrollView>
            <TrayJsx
                active = { props.active }
                navigation = { props.navigation } />
        </View>
    )
};

export const ScreenWithBackBarJsx = (props) => {
    return (
        <View style = { { flex: 1 } }>
            <BackBarJsx navigation = { props.navigation } />
            <ScrollView>
                { props.children }
            </ScrollView>
        </View>
    );
};

export const ScreenWithFullNavigationJsx = (props) => {
    return (
        <View style = { { flex: 1 } }>
            <BackBarJsx navigation = { props.navigation } />
            <ScrollView>
                { props.children }
            </ScrollView>
            <TrayJsx
                active = { props.active }
                navigation = { props.navigation } />
        </View>
    );
}