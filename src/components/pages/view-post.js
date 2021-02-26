import React from "react";

import { ScreenWithFullNavigationJsx } from "src/components/navigation/navigators";
import { PostByIdJsx } from "src/components/posts/post";

const ViewPostJsx = (props) => {
    return (
        <ScreenWithFullNavigationJsx
            active = { props.navigation.getParam("originTab", "Timeline") }
            navigation = { props.navigation }>
            <PostByIdJsx id = { props.id } />
        </ScreenWithFullNavigationJsx>
    );
}

export default ViewPostJsx;