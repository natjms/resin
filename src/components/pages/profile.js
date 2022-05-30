import React, { useState, useEffect } from "react";
import {
    View,
    Dimensions,
    Image,
    Text,
    TouchableOpacity,
    FlatList,
    ScrollView,
} from "react-native";

import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { activeOrNot } from "src/interface/interactions";
import HTML from "react-native-render-html";
import {
    withLeadingAcct,
    withoutHTML,
    pluralize,
    StatusBarSpace,
} from "src/interface/rendering";
import * as requests from "src/requests";

import GridView from "src/components/posts/grid-view";

import { MenuOption } from "react-native-popup-menu";
import ContextMenu from "src/components/context-menu.js";

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

const ViewProfile = ({ navigation, route }) => {
    // As rendered when opened from somewhere other than the tab bar
    const [state, setState] = useState({
        loaded: false,
        profile: route.params.profile,
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
                ? <ScrollView>
                    <RawProfile
                        navigation = { navigation }
                        onFollow = { _handleFollow }
                        onHide = { _handleHide }
                        onMute = { _handleMute }
                        onBlock = { _handleBlock }
                        profile = { state.profile }
                        listedUsers = { state.listedUsers }
                        followed = { state.followed }
                        posts = { state.posts }/>
                </ScrollView>
                : <></>
            }
        </>
    );
}

const Profile = ({ navigation }) => {
    const [state, setState] = useState({
        loaded: false,
    });

    const init = async () => {
        const [
            profilePair,
            instancePair,
            tokenPair
        ] = await AsyncStorage.multiGet([
            "@user_profile",
            "@user_instance",
            "@user_token",
        ]);

        const profile = JSON.parse(profilePair[1]);
        const instance = instancePair[1];
        const accessToken = JSON.parse(tokenPair[1]).access_token;

        const latestProfile =
            await requests.fetchProfile(instance, profile.id, accessToken);
        const posts =
            await requests.fetchAccountStatuses(instance, profile.id, accessToken);
		const followers =
            await requests.fetchFollowers(instance, profile.id, accessToken);

        const latestProfileString = JSON.stringify(latestProfile);

        // Update the profile in AsyncStorage if it's changed
        if(latestProfileString != JSON.stringify(profile)) {
            await AsyncStorage.setItem(
                "@user_profile",
                latestProfileString
            );
        }

        setState({...state,
            profile: latestProfile,
            posts: posts,
		    listedUsers: followers,
            loaded: true,
        });
    };

    useEffect(() => { init(); }, []);

    return (
        <>
            <StatusBarSpace/>
            { state.loaded
                ? <ScrollView>
                    <RawProfile
                        navigation = { navigation }
                        own = { true }
                        profile = { state.profile }
                        posts = { state.posts }
	        	    	listedUsers = { state.listedUsers }/>
                </ScrollView>
                : <></>
            }
        </>
    )
};

const RawProfile = (props) => {
    let profileButton;

    /* Some profiles won't have a note, and react-native-render-html will
     * issue a warning if it isn't passed any content. So, if there's no
     * note with the account (or if it's an empty string, possibly), the
     * element shouldn't be rendered at all.
     */
    let noteIfPresent = <></>;
    if (props.profile.note != null && props.profile.note.length != "") {
        noteIfPresent = (
            <HTML
                source = { { html: props.profile.note } }
                contentWidth = { SCREEN_WIDTH } />
        );
    }

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
                        !props.own
                        ? <ContextMenu
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
                        </ContextMenu>
                        : <></>
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
                { noteIfPresent }
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

            <GridView
                posts = { props.posts }
                navigation = { props.navigation }/>
        </View>
    );
};

const SCREEN_WIDTH = Dimensions.get("window").width;

const styles = {
    jumbotron: {
        padding: SCREEN_WIDTH / 20,
    },
    profileHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: SCREEN_WIDTH / 20,
    },
    displayName: {
        fontSize: 24
    },
    avatar: {
        width: SCREEN_WIDTH / 5,
        height: SCREEN_WIDTH / 5,

        borderRadius: SCREEN_WIDTH / 10,
        marginRight: SCREEN_WIDTH / 20,
    },
    profileHeaderIcon: {
        width: SCREEN_WIDTH / 12,
        height: SCREEN_WIDTH / 12,
    },
    profileContextContainer: {
        marginLeft: "auto",
        marginRight: SCREEN_WIDTH / 15,
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
                width: SCREEN_WIDTH / 3,
            },
            value: {
                width: (SCREEN_WIDTH / 3) * 2,
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

export { ViewProfile, Profile as default };
