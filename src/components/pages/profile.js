import React, { useState, useEffect } from "react";
import {
    View,
    Dimensions,
    Image,
    Text,
    TouchableOpacity,
    FlatList,
} from "react-native";

import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { activeOrNot } from "src/interface/interactions";
import { withoutHTML } from "src/interface/rendering";
import * as requests from "src/requests";

import GridViewJsx from "src/components/posts/grid-view";
import {
    ScreenWithTrayJsx,
    ScreenWithFullNavigationJsx
} from "src/components/navigation/navigators";

import ModerateMenuJsx from "src/components/moderate-menu.js";

const TEST_IMAGE = "https://cache.desktopnexus.com/thumbseg/2255/2255124-bigthumbnail.jpg";
const TEST_POSTS = [
    {
        id: 1,
        media_attachments: [
            {preview_url: TEST_IMAGE}
        ]
    },
    {
        id: 2,
        media_attachments: [
            {preview_url: TEST_IMAGE}
        ]
    },
    {
        id: 3,
        media_attachments: [
            {preview_url: TEST_IMAGE}
        ]
    },
    {
        id: 4,
        media_attachments: [
            {preview_url: TEST_IMAGE}
        ]
    }
];

const TEST_PROFILE = {
    username: "njms",
    acct: "njms",
    display_name: "Nat🔆",
    locked: false,
    bot: false,
    note: "Yeah heart emoji.",
    avatar: TEST_IMAGE,
    followers_count: "1 jillion",
    statuses_count: 334,
    fields: [
        {
            name: "Blog",
            value: "<a href=\"https://njms.ca\">https://njms.ca</a>",
            verified_at: "some time"
        },
        {
            name: "Github",
            value: "<a href=\"https://github.com/natjms\">https://github.com/natjms</a>",
            verified_at: null
        }
    ]
};

const TEST_YOUR_FOLLOWERS = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
];

const TEST_THEIR_FOLLOWERS = [
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 6 },
];

function getMutuals(yourFollowing, theirFollowers) {
    // Where yours and theirs are arrays of followers, as returned by the API
    // Returns a list of people you are following that are following some other
    // account

    const acctsArray = ({acct}) => acct;
    const asIDs = new Set(theirFollowers.map(acctArray));

    return yourFollowing.filter(x => asIDs.has(idify(x)));
}

const HTMLLink = ({link}) => {
    let url = link.match(/https?:\/\/\w+\.\w+/);

    if (url) {
        return (
            <Text
                style = { styles.anchor }
                onPress = {
                    () => {
                        Linking.openURL(url[0]);
                    }
            }>
                { withoutHTML(link) }
            </Text>
        );
    } else {
        return (<Text> { withoutHTML(link) } </Text>);
    }
}

const ViewProfileJsx = ({navigation}) => {
    // As rendered when opened from somewhere other than the tab bar
    const [state, setState] = useState({
        loaded: false,
        profile: navigation.getParam("profile"),
    });

    useEffect(() => {
        AsyncStorage
            .multiGet(["@user_profile", "@user_instance", "@user_token"])
            .then(([ownProfilePair, ownDomainPair, tokenPair]) =>
                [
                    JSON.parse(ownProfilePair[1]),
                    ownDomainPair[1],
                    JSON.parse(tokenPair[1]).access_token,
                ]
            )
            .then(([ ownProfile, ownDomain, accessToken ]) => {
                const parsedAcct = state.profile.acct.split("@");
                const domain = parsedAcct.length == 1
                    ? ownDomain // There's no @ in the acct, thus it's a local user
                    : parsedAcct [1] // The part of profile.acct after the @

                return Promise.all([
                    requests.fetchFollowing(
                        ownDomain,
                        ownProfile.id,
                        accessToken
                    ),
                    requests.fetchFollowers(
                        domain,
                        state.profile.id,
                        accessToken
                    ),
                ]);
            })
            .then(([ ownFollowing, theirFollowers ]) =>
                setState({...state,
                    mutuals: getMutuals(ownFollowing, theirFollowers),
                    loaded: true,
                })
            );
    }, []);
    return (
        <>
            { state.loaded
                ? <ScreenWithFullNavigationJsx
                      active = { navigation.getParam("originTab") }
                      navigation = { navigation }>
                    <RawProfileJsx
                        profile = { state.profile }
                        notifs = { state.notifs }
                        posts = { TEST_POSTS }/>
                </ScreenWithFullNavigationJsx>
                : <></>
            }
        </>
    );
}

const ProfileJsx = ({ navigation }) => {
    const [state, setState] = useState({
        loaded: false,
    });

    useEffect(() => {
        let profile;
        let notifs;
        let domain;
        let accessToken;

        AsyncStorage
            .multiGet([
                "@user_profile",
                "@user_notifications",
                "@user_instance",
                "@user_token",
            ])
            .then(([profilePair, notifPair, domainPair, tokenPair]) => {
                profile = JSON.parse(profilePair[1]);
                notifs = JSON.parse(notifPair[1]);
                domain = domainPair[1];
                accessToken = JSON.parse(tokenPair[1]).access_token;

                return Promise.all([
                    requests.fetchProfile(domain, profile.id),
                    requests.fetchAccountStatuses(domain, profile.id, accessToken),
                ]);
            })
            .then(([latestProfile, posts]) => {
                if(JSON.stringify(latestProfile) != JSON.stringify(profile)) {
                    profile = latestProfile
                }

                setState({...state,
                    profile: profile,
                    notifs: notifs,
                    posts: posts,
                    loaded: true,
                });
            });
    }, []);
    return (
        <>
            { state.loaded
                ? <ScreenWithTrayJsx
                      active = "Profile"
                      navigation = { navigation }
                      active = "Profile">
                    <RawProfileJsx
                        navigation = { navigation }
                        own = { true }
                        profile = { state.profile }
                        posts = { state.posts }
                        notifs = { state.notifs }/>
                </ScreenWithTrayJsx>
                : <></>
            }
        </>
    )
};

const RawProfileJsx = (props) => {
    let [state, setState] = useState({
        own: props.own,
        profile: props.profile,
        notifs: props.notifs,
    });

    const notif_pack = {
        active: require("assets/eva-icons/bell-unread.png"),
        inactive: require("assets/eva-icons/bell-black.png")
    }

    const _handleFollow = () => {};

    let profileButton;
    if (props.own) {
        profileButton = (
            <TouchableOpacity
                  onPress = {
                    () => {
                        props.navigation.navigate("Settings");
                    }
                  }>
                <View style = { styles.button }>
                    <Text style = { styles.buttonText }>Settings</Text>
                </View>
            </TouchableOpacity>
        );
    } else {
        profileButton = (
            <TouchableOpacity onPress = { _handleFollow }>
                <View style = { styles.button }>
                    <Text style = { styles.buttonText }>Follow</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View>
            <View style = { styles.jumbotron }>
                <View style = { styles.profileHeader }>
                    <Image
                        source = { { uri: props.profile.avatar } }
                        style = { styles.avatar } />
                    <View>
                        <Text
                            style = { styles.displayName }>
                            { props.profile.display_name}
                        </Text>
                        <Text style={ styles.strong }>
                            @{ props.profile.acct }
                        </Text>
                    </View>
                    {
                        state.own ?
                            <View style = { styles.profileContextContainer }>
                                <TouchableOpacity
                                      onPress = {
                                        () => {
                                            props.navigation.navigate("Notifications");
                                        }
                                      }>
                                    <Image
                                        source = {
                                            activeOrNot(
                                                props.notifs.unread,
                                                notif_pack
                                            )
                                        }
                                        style = { styles.profileHeaderIcon } />
                                </TouchableOpacity>
                            </View>
                        : <ModerateMenuJsx
                            triggerStyle = { styles.profileHeaderIcon }
                            containerStyle = { styles.profileContextContainer } />
                    }
                </View>
                <Text style = { styles.accountStats }>
                    { props.profile.statuses_count } posts &#8226;&nbsp;
                    <Text onPress = {
                            () => {
                                const context = props.own ?
                                    "People following you"
                                    : "Your mutual followers with " + props.profile.display_name;
                                props.navigation.navigate("UserList", {
                                    context: context,
                                });
                            }
                          }>
                        {
                            state.own ?
                                <>View followers</>
                                : <>{ props.mutuals + " mutuals" }</>
                        }

                    </Text>
                </Text>
                <Text style = { styles.note }>
                    {props.profile.note}
                </Text>
                <View style = { styles.fields.container }>
                    { props.profile.fields
                        ? props.profile.fields.map((field, index) => (
                            <View
                                  style = { styles.fields.row }
                                  key = { index }>
                                <View style = { styles.fields.cell.name }>
                                    <Text style = {
                                        { textAlign: "center", }
                                    }>
                                    { field.name }
                                    </Text>
                                </View>
                                <View style = { styles.fields.cell.value }>
                                    <HTMLLink link = { field.value }/>
                                </View>
                            </View>
                        ))
                        : <></>
                    }
                </View>
                {profileButton}
            </View>

            <GridViewJsx
                posts = { props.posts }
                openPostCallback = {
                    (id) => {
                        props.navigation.navigate("ViewPost", {
                            id: id,
                            originTab: "Profile"
                        });
                    }
                } />
        </View>
    );
};

const screen_width = Dimensions.get("screen").width;
const screen_height = Dimensions.get("screen").height;

const styles = {
    jumbotron: {
        padding: screen_width / 20,
    },
    profileHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: screen_width / 20,
    },
    displayName: {
        fontSize: 24
    },
    avatar: {
        width: screen_width / 5,
        height: screen_width / 5,

        borderRadius: screen_width / 10,
        marginRight: screen_width / 20,
    },
    profileHeaderIcon: {
        width: screen_width / 12,
        height: screen_width / 12,
    },
    profileContextContainer: {
        marginLeft: "auto",
        marginRight: screen_width / 15,
    },
    accountStats: {
        fontSize: 14,
        fontWeight: "bold"
    },
    note: {
        fontSize: 16,
        marginTop: 10,
    },
    fields: {
        container: { marginTop: 20, },
        row: {
            padding: 10,
            flexDirection: "row",
        },
        cell: {
            name: {
                width: screen_width / 3,
            },
            value: {
                width: (screen_width / 3) * 2,
            },
        }
    },
    anchor: {
        color: "#888",
        textDecorationLine: "underline"
    },
    button: {
        borderWidth: 1,
        borderColor: "#888",
        borderRadius: 5,

        padding: 10,
        marginTop: 10
    },
    buttonText: {
        textAlign: "center"
    },
    strong: {
        fontWeight: "bold",
    },
};

export { ViewProfileJsx, ProfileJsx as default };
