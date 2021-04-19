import React from "react";
import { SafeAreaView } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { StatusBarSpace } from "src/interface/rendering";
import BackBarJsx from "./back-bar";
import TrayJsx from "src/components/navigation/tray";

export const ScreenWithTrayJsx = (props) => {
    return (
        <SafeAreaView style = { { flex: 1 } }>
            <ScrollView>
                <StatusBarSpace
                    color = {
                        props.statusBarColor
                            ? props.statusBarColor
                            : "transparent"
                    }/>
                { props.children }
            </ScrollView>
            <TrayJsx
                active = { props.active }
                navigation = { props.navigation } />
        </SafeAreaView>
    );
};

export const ScreenWithBackBarJsx = (props) => {
    return (
        <SafeAreaView style = { { flex: 1 } }>
            <StatusBarSpace color = "white"/>
            <BackBarJsx navigation = { props.navigation }>
                { props.renderBackBar != undefined
                    ? props.renderBackBar()
                    : <></>
                }
            </BackBarJsx>
            <ScrollView>
                { props.children }
            </ScrollView>
        </SafeAreaView>
    );
};

export const ScreenWithFullNavigationJsx = (props) => {
    return (
        <SafeAreaView style = { { flex: 1 } }>
            <StatusBarSpace color = "white"/>
            <BackBarJsx navigation = { props.navigation }>
                { props.renderBackBar != undefined
                    ? props.renderBackBar()
                : <></>
                }
            </BackBarJsx>
            <ScrollView>
                { props.children }
            </ScrollView>
            <TrayJsx
                active = { props.active }
                navigation = { props.navigation } />
        </SafeAreaView>
    );
};
