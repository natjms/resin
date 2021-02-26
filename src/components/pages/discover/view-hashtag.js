import React, { useState } from "react";
import { View, Image, Dimensions, Text } from "react-native";
import { ScreenWithFullNavigationJsx } from "src/components/navigation/navigators";
import PagedGridJsx from "src/components/posts/paged-grid";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const FollowHashtagButtonJsx = ({followed, onPress}) => {
    return (
        <TouchableWithoutFeedback
             style = {
                [
                    styles.button,
                    followed ? { backgroundColor: "black" } : {}
                ]
             }
             onPress = { onPress }>
            <Text
                style = { followed ? { color: "white" } : {} }>
                { followed ? "Followed" : "Follow" }
            </Text>
        </TouchableWithoutFeedback>
    );
};

const ViewHashtagJsx = ({navigation}) => {
    let [state, setState] = useState({
        name: navigation.getParam("name", ""),
        posts: [],
        nPosts: 0,
        followed: false,
        loaded: false,
    });
    return (
        <ScreenWithFullNavigationJsx
             active = "Discover"
             navigation = { navigation }>
            <View>
                <View style = { styles.headerContainer }>
                    <View>
                        <Image
                            style = { styles.image }
                            source = { require("assets/hashtag.png") } />
                    </View>
                    <View style = { styles.headerText }>
                        <Text style = { styles.hashtag}>
                            #{ state.name } 
                        </Text>
                        <Text>
                            <strong>{ state.nPosts }</strong> posts
                        </Text>

                        <FollowHashtagButtonJsx 
                            followed = { state.followed }
                            onPress = { () => {
                                // Send request to follow hashtag and such...
                                setState({ ...state, followed: !state.followed});
                            }
                            }/>
                    </View>
                </View>
                <PagedGridJsx
                    navigation = { navigation }
                    originTab = "Discover" />
            </View>
        </ScreenWithFullNavigationJsx>
    );
};

const screen_width = Dimensions.get("window").width;
const styles = {
    headerContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderBottom: "2px solid black"
    },
    image: {
        width: screen_width / 3,
        height: screen_width / 3,
        border: "2px solid black",
        borderRadius: "100%",
        marginRight: 20
    },
    hashtag: {
        fontWeight: "bold",
        fontSize: "1.2em"
    },
    button: {
        border: "2px solid black",
        borderRadius: 5,
        padding: 10,
        paddingLeft: 30,
        paddingRight: 30,
        marginTop: 10
    },
}

export default ViewHashtagJsx;