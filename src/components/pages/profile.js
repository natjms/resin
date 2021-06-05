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
import { withoutHTML, pluralize } from "src/interface/rendering";
import * as requests from "src/requests";

import GridViewJsx from "src/components/posts/grid-view";
import {
    ScreenWithTrayJsx,
    ScreenWithBackBarJsx,
} from "src/components/navigation/navigators";

import { MenuOption } from "react-native-popup-menu";
import ContextMenuJsx from "src/components/context-menu.js";

function getMutuals(yourFollowing, theirFollowers) {
    // Where yours and theirs are arrays of followers, as returned by the API
    // Returns a list of people you are following that are following some other
    // account

    const getAcct = ({acct}) => acct;
    const theirsAsAccts = new Set(
        theirFollowers.map(({acct}) => acct)
    );

    return yourFollowing.filter(x =>
        theirsAsAccts.has(x.acct)
    );
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
        let ownProfile, instance, accessToken, domain;
        AsyncStorage
            .multiGet(["@user_profile", "@user_instance", "@user_token"])
            .then(([ ownProfilePair, ownDomainPair, tokenPair ]) => {
                ownProfile = JSON.parse(ownProfilePair[1]);
                instance = ownDomainPair[1];
                accessToken = JSON.parse(tokenPair[1]).access_token;

                return Promise.all([
                    requests.fetchFollowing(
                        instance,
                        ownProfile.id,
                        accessToken
                    ),
                    requests.fetchFollowers(
                        instance,
                        state.profile.id,
                        accessToken
                    ),
                    requests.fetchAccountStatuses(
                        instance,
                        state.profile.id,
                        accessToken
                    )
                ]);
            })
            .then(([ ownFollowing, theirFollowers, posts ]) => {
                setState({...state,
                    listedUsers: getMutuals(ownFollowing, theirFollowers),
                    posts: posts,
                    instance,
                    ownProfile,
                    accessToken,
                    followed: ownFollowing.some(x => x.id == state.profile.id),
                    loaded: true,
                });
            });
    }, []);

    const _handleFollow = async () => {
        if (!state.followed) {
            await requests.followAccount(
                state.instance,
                state.profile.id,
                state.accessToken
            );
        } else {
            await requests.unfollowAccount(
                state.instance,
                state.profile.id,
                state.accessToken
            );
        }

        setState({...state,
            followed: !state.followed,
        });
    };

    const _handleHide = async () => {
        await requests.muteAccount(
            state.instance,
            state.profile.id,
            state.accessToken,

            // Thus, only "mute" statuses
            { notifications: false, }
        );

        navigation.goBack();
    };

    const _handleMute = async () => {
        await requests.muteAccount(
            state.instance,
            state.profile.id,
            state.accessToken,
        );

        navigation.goBack();
    };

    const _handleBlock = async () => {
        await requests.blockAccount(
            state.instance,
            state.profile.id,
            state.accessToken,
        );

        navigation.goBack();
    };

    return (
        <>
            { state.loaded
                ? <ScreenWithBackBarJsx
                      active = { navigation.getParam("originTab") }
                      navigation = { navigation }>
                    <RawProfileJsx
                        navigation = { navigation }
                        onFollow = { _handleFollow }
                        onHide = { _handleHide }
                        onMute = { _handleMute }
                        onBlock = { _handleBlock }
                        profile = { state.profile }
                        listedUsers = { state.listedUsers }
                        followed = { state.followed }
                        posts = { state.posts }/>
                </ScreenWithBackBarJsx>
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
		    requests.fetchFollowers(domain, profile.id, accessToken),
                ]);
            })
            .then(([latestProfile, posts, followers]) => {
                if(JSON.stringify(latestProfile) != JSON.stringify(profile)) {
                    profile = latestProfile
                }

                setState({...state,
                    profile: profile,
                    notifs: notifs,
                    posts: posts,
		    listedUsers: followers,
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
		    	listedUsers = { state.listedUsers }
                        notifs = { state.notifs }/>
                </ScreenWithTrayJsx>
                : <></>
            }
        </>
    )
};

const RawProfileJsx = (props) => {
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
                <View style = { styles.button.container }>
                    <Text style = { styles.button.text }>Settings</Text>
                </View>
            </TouchableOpacity>
        );
    } else {
        profileButton = (
            <TouchableOpacity onPress = { props.onFollow }>
                <View style = { [
                        styles.button.container,
                        props.followed ? styles.button.dark : {},
                      ] }>
                    <Text style = {[
                            styles.button.text,
                            props.followed ? styles.button.darkText : {},
                          ]}>
                        { props.followed
                            ? "Unfollow"
                            : "Follow"
                        }
                    </Text>
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
                        props.own ?
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
                        : <ContextMenuJsx
                              containerStyle = {
                                  styles.profileContextContainer
                              }>
                            <MenuOption
                                onSelect = { props.onHide }
                                text = "Don't show me their posts" />
                            <MenuOption
                                onSelect = { props.onMute }
                                text = "Mute" />
                            <MenuOption
                                onSelect = { props.onBlock }
                                text = "Block" />
                        </ContextMenuJsx>
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
				    data: props.listedUsers,
                                });
                            }
                          }>
                        {
                            props.own ?
                                <>View followers</>
                                : <>
                                    {
                                        props.listedUsers.length
                                            + pluralize(
                                                props.listedUsers.length,
                                                " mutual",
                                                " mutuals"
                                            )
                                    }
                                </>
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
                navigation = { props.navigation }/>
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
        container: {
            borderWidth: 1,
            borderColor: "#888",
            borderRadius: 5,

            padding: 10,
            marginTop: 10
        },
        dark: { backgroundColor: "black", },
        text: { textAlign: "center" },
        darkText: { color: "white", },
    },
    strong: {
        fontWeight: "bold",
    },
};

export { ViewProfileJsx, ProfileJsx as default };
