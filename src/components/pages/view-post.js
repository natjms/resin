import React from "react";
import { ScrollView } from "react-native";

import { PostByData } from "src/components/posts/post";

const ViewPost = ({ navigation, route }) => (
    <ScrollView>
        <PostByData
            navigation = { navigation }
            afterDelete = {
                () => navigation.goBack()
            }
            afterModerate = {
                () => navigation.goBack()
            }
            data = { route.params.post } />
    </ScrollView>
)

export default ViewPost;
