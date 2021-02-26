import React from "react";
import { Dimensions, View, Image, Text } from "react-native";

import TimelineViewJsx from "src/components/posts/timeline-view";
import { ScreenWithTrayJsx } from "src/components/navigation/navigators";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const TEST_IMAGE = "https://cache.desktopnexus.com/thumbseg/2255/2255124-bigthumbnail.jpg";

const TEST_POSTS = [
    {
        id: 1,
        avatar: TEST_IMAGE,
        username: "njms",
        favourited: false,
        reblogged: false,
        content: "Also learning Claire de Lune feels a lot like reading the communist manifesto",
        timestamp: 1596745156000,
        media_attachments: [
            {preview_url: TEST_IMAGE}
        ]
    },
    {
        id: 2,
        avatar: TEST_IMAGE,
        username: "njms",
        favourited: false,
        reblogged: false,
        content: "Also learning Claire de Lune feels a lot like reading the communist manifesto",
        timestamp: 1596745156000,
        media_attachments: [
            {preview_url: TEST_IMAGE}
        ]
    }
];

const FeedJsx = (props) => {
    const checkmark = require("assets/eva-icons/checkmark-circle-large.png");

    return (
        <ScreenWithTrayJsx
                active = "Feed"
                navigation = { props.navigation }>
            <TimelineViewJsx posts = { TEST_POSTS } />
            <div style = { styles.interruptionOuter }>
                <View style = { styles.interruption }>
                    <Image
                        source = { checkmark }
                        style = { styles.checkmark }/>
                    
                    <Text style = { styles.interruptionHeader }>
                        You're all caught up.
                    </Text>
                    <br />
                    <Text> Wow, it sure is a lovely day outside 🌳 </Text>

                    <TouchableWithoutFeedback
                            style = { styles.buttonOlder }>
                        <Text> See older posts </Text>
                    </TouchableWithoutFeedback>
                </View>
            </div>
        </ScreenWithTrayJsx>
        
    );
};

const screen_width = Dimensions.get("window").width;
const screen_height = Dimensions.get("window").height;
const styles = {
    timeline: {
        height: screen_height - (screen_height / 12)
    },
    interruptionOuter: {
        borderTop: "2px solid #CCC",
    },
    interruption: {
        marginTop: 10,
        marginBottom: 10,

        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    interruptionHeader: {
        fontSize: "1.3em"
    },
    checkmark: {
        width: screen_width * 0.3,
        height: screen_width * 0.3
    },
    buttonOlder: {
        border: "2px solid black",
        borderRadius: 5,

        margin: 30,
        padding: 5
    }
};

export default FeedJsx;