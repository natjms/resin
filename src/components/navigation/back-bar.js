import React from "react";
import { Image } from "react-native";
import { TouchableWithoutFeedback } from "react-native";

const BackBarJsx = (props) => {
    const backIcon = require("assets/eva-icons/back.png");

    return (
        <nav style = { styles.nav }>
            <TouchableWithoutFeedback 
                onPress = { () => props.navigation.goBack() }>
                <Image
                    style = { styles.button }
                    source = { backIcon }/>
            </TouchableWithoutFeedback>
        </nav>
    );
};

const styles = {
    nav: {
        padding: 15,

        borderBottom: "2px solid #CCC",
        backgroundColor: "white"
    },
    button: {
        width: 30,
        height: 30
    }
}

export default BackBarJsx;