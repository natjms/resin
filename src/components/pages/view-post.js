import React, { useState, useEffect } from "react";

import { ScreenWithBackBarJsx } from "src/components/navigation/navigators";
import { PostByDataJsx } from "src/components/posts/post";

const ViewPostJsx = ({navigation}) => {
    const [state, setState] = useState({
        post: navigation.getParam("post", null),
        loaded: false,
    });

    if (state.post == null) {
        throw Error("Post not given when navigating to ViewPost!");
    }

    return (
        <ScreenWithBackBarJsx
              navigation = { navigation }>
            <PostByDataJsx
                navigation = { navigation }
                afterDelete = {
                    () => navigation.goBack()
                }
                afterModerate = {
                    () => navigation.goBack()
                }
                data = { state.post } />
        </ScreenWithBackBarJsx>
    );
}

export default ViewPostJsx;
