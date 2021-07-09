import React from "react";
import { Image } from "react-native";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const BackBarJsx = (props) => {

    return (
        <View style = { styles.nav }>
            <TouchableOpacity
                  onPress = { () => props.navigation.goBack() }
                  style = { styles.button }>
                <Ionicons
                    name = "chevron-back"
                    color = "#000"
                    size = { 30 }/>
            </TouchableOpacity>
            <View style = { styles.rest }>
                { props.children }
            </View>
        </View>
    );
};

const styles = {
    nav: {
        borderBottomWidth: 1,
        borderBottomColor: "#CCC",
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
