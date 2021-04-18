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
        replies_count: 3,
        favourited: false,
        reblogged: false,
        content: "Also learning Claire de Lune feels a lot like reading the communist manifesto",
        timestamp: 1596745156000,
        media_attachments: [
            {url: TEST_IMAGE}
        ]
    },
    {
        id: 2,
        avatar: TEST_IMAGE,
        username: "njms",
        favourited: false,
        reblogged: false,
        replies_count: 0,
        content: "Also learning Claire de Lune feels a lot like reading the communist manifesto",
        timestamp: 1596745156000,
        media_attachments: [
            { url: "https://college.mayo.edu/media/mccms/content-assets/campus-amp-community/arizona/mayo-clinic-phoenix-arizona-is453080663-hero-mobile.jpg" },
            { url: TEST_IMAGE },
            { url: TEST_IMAGE }
        ]
    }
];

const FeedJsx = (props) => {
    const checkmark = require("assets/eva-icons/checkmark-circle-large.png");

    return (
        <ScreenWithTrayJsx
                active = "Feed"
                navigation = { props.navigation }>

            <TimelineViewJsx
                    navigation = { props.navigation }
                    posts = { TEST_POSTS } />
            <View style = { styles.interruptionOuter }>

                <View style = { styles.interruption }>
                    <Image
                        source = { checkmark }
                        style = { styles.checkmark }/>

                    <Text style = { styles.interruptionHeader }>
                        You're all caught up.
                    </Text>
                    <Text> Wow, it sure is a lovely day outside 🌳 </Text>

                    <TouchableWithoutFeedback
                            style = { styles.buttonOlder }>
                        <Text> See older posts </Text>
                    </TouchableWithoutFeedback>
                </View>
            </View>
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
        borderTopWidth: 1,
        borderTopColor: "#CCC",
    },
    interruption: {
        marginTop: 10,
        marginBottom: 10,

        justifyContent: "center",
        alignItems: "center",
    },
    interruptionHeader: {
        fontSize: 21
    },
    checkmark: {
        width: screen_width * 0.3,
        height: screen_width * 0.3
    },
    buttonOlder: {
        borderWidth: 1,
        borderColor: "#888",
        borderRadius: 5,

        margin: 30,
        padding: 5
    }
};

export default FeedJsx;
