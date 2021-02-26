import React, { useEffect, useState } from "react";
import { Image, Dimensions, TouchableWithoutFeedback } from "react-native";

const GridPostJsx = (props) => {
    return (
        <TouchableWithoutFeedback
            onPress={ () => props.openPostCallback(props.id)}>
            <Image
                source = { { uri: props.previewUrl } }
                style = { styles.gridImage } />
        </TouchableWithoutFeedback>
    )
}

const screen_width = Dimensions.get("window").width;
const styles = {
    gridImage: {
        width: screen_width / 3,
        height: screen_width / 3
    }
};

export default GridPostJsx;