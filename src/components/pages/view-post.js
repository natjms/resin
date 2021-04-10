import React from "react";

import { ScreenWithFullNavigationJsx } from "src/components/navigation/navigators";
import { PostByIdJsx } from "src/components/posts/post";

const ViewPostJsx = ({navigation}) => {
    const id = navigation.getParam("id", undefined);

    if (id == undefined) {
        throw Error("ID not specified when navigating to ViewPost!");
    }

    return (
        <ScreenWithFullNavigationJsx
            active = { navigation.getParam("originTab", "Timeline") }
            navigation = { navigation }>
            <PostByIdJsx
                navigation = { navigation }
                id = { id } />
        </ScreenWithFullNavigationJsx>
    );
}

export default ViewPostJsx;
