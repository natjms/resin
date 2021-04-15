import React from "react";
import { Image } from "react-native";
import { TouchableOpacity, View } from "react-native";

const BackBarJsx = (props) => {
    const backIcon = require("assets/eva-icons/back.png");

    return (
        <View style = { styles.nav }>
            <TouchableOpacity
                  onPress = { () => props.navigation.goBack() }
                  style = { styles.button }>
                <Image
                    style = { styles.chevron }
                    source = { backIcon }/>
            </TouchableOpacity>
            <View style = { styles.rest }>
                { props.children }
            </View>
        </View>
    );
};

const styles = {
    nav: {
        borderBottom: "2px solid #CCC",
        backgroundColor: "white",

        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10,
    },
    rest: {
        flexGrow: 1,
    },
    chevron: {
        width: 30,
        height: 30,
    },
    button: {
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
    },
}

export default BackBarJsx;
