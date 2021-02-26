import React, { useEffect, useState } from "react";
import { View, TextInput, Text, Dimensions } from "react-native";

import PagedGridJsx from "src/components/posts/paged-grid";
import { ScreenWithTrayJsx } from "src/components/navigation/navigators";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const DiscoverJsx = (props) => {
    return (
        <ScreenWithTrayJsx
                active = "Discover"
                navigation = { props.navigation }>
            <TouchableWithoutFeedback
                onPress = { () => props.navigation.navigate("Search") }>
                <View style = { styles.form }>
                    <View style = { styles.searchBarContainer }>
                        <Text style = { styles.searchBar }>
                            Search...
                        </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <PagedGridJsx
                navigation = { props.navigation }
                originTab = "Discover" />
        </ScreenWithTrayJsx>
    );
};

const styles = {
    form: {
        display: "flex",
        justifyContent: "center",
        backgroundColor: "white",
        padding: 20
    },
    searchBar: {
        padding: 10,
        fontSize: "1.1em",
        color: "#888"
    },
};

export default DiscoverJsx;