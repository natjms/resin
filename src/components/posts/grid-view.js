import React from "react";
import {
    View,
    Dimensions,
    Image,
    TouchableOpacity,
} from "react-native";

function partition(arr, size) {
    let newArray = [];
    for (let i = 0; i < arr.length; i += size) {
        const part = arr.slice(i, i + 3);
        newArray.push(part);
    }

    return newArray
}

const GridPostJsx = (props) => {
    return (
        <TouchableOpacity
            onPress={ () => {
                props.navigation.navigate("ViewPost", {
                    post: props.data,
                });
            }}>
            <Image
                  source = {
                      { uri: props.data.media_attachments[0].preview_url }
                  }
                style = { styles.gridImage } />
        </TouchableOpacity>
    )
}

const GridViewJsx = (props) => {
    let rows = partition(props.posts, 3);
    return (
        <View>
            {
                rows.map((row, i) => {
                    return (
                        <View style = { styles.gridRow }
                            key = { i }>
                            {
                                row.map((post) => {
                                    return (
                                        <View key = { post.id }>
                                            <GridPostJsx
                                                navigation = { props.navigation }
                                                data = { post } />
                                        </View>
                                    );
                                })
                            }
                        </View>
                    )
                })
            }
        </View>
    );
};

const screen_width = Dimensions.get("window").width
const styles = {
    gridRow: {
        padding: 0,
        margin: 0,
        flexDirection: "row"
    },
    gridImage: {
        width: screen_width / 3,
        height: screen_width / 3
    },
};

export default GridViewJsx;
