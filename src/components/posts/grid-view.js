import React from "react";
import { View, Dimensions, Image } from "react-native";

import GridPostJsx from "src/components/posts/grid-post"

function partition(arr, size) {
    let newArray = [];
    for (let i = 0; i < arr.length; i += size) {
        const part = arr.slice(i, i + 3);
        newArray.push(part);
    }

    return newArray
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
                                    const post_url = post
                                        .media_attachments[0]
                                        .preview_url;

                                    return (
                                        <View key = { post.id }>
                                            <GridPostJsx
                                                id = { post.id }
                                                previewUrl = { post_url }
                                                openPostCallback = {
                                                    (id) => props.openPostCallback(id)
                                                }
                                                />
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

        listStyle: "none",

        display: "flex",
        flexDirection: "row"
    }
};

export default GridViewJsx;