<img
    src="assets/logo/logo-wordmark.png"
    alt="A screenshot of the timeline"
    width="400" />

Resin is the Pixelfed client you won't get addicted to. The primary goal of this
project is to create a social-media interface that has no dark patterns and
otherwise goes out of its way to prevent the user from getting addicted to it.
In other words, this app practices
[ethical anti-design](https://njms.ca/posts/ethical-anti-design.html). The way
it does this is by excluding dark patterns like infinite scrolling and
putting obstacles in place to minimize the amount of time the person spends
taking unhealthy actions that are otherwise unavoidable.

## Goal

The goal of this project is to create a model for what social media could look
like were it not designed to be addictive. The Fediverse, not being dependent
on ad revenue, shouldn't need to capitalize on people's attention. Still, many
of the apps we use to interact with the Fediverse use the same dark patterns
developed by companies that do. While these dark patterns may seem like industry
standards, we have no need to follow them. This project seeks to demonstrate
the different ways to go about doing that.

## Current Objectives
 * ~~Beta release~~
 * Full 1.0 release
 * [Sabbaticals](https://github.com/natjms/resin/issues/19)
 * Support for Mastodon instances
 * Support for multiple accounts

## Screenshots
<img
    src="assets/screenshots/login.png"
    alt="A screenshot of the login interface"
    width="200" />
<img
    src="assets/screenshots/feed.png"
    alt="A screenshot of the followers feed"
    width="200" />
<img
    src="assets/screenshots/comments.png"
    alt="A screenshot of the comments page"
    width="200" />
<img
    src="assets/screenshots/moderation.png"
    alt="A screenshot of the moderation menu on a post"
    width="200" />
<img
    src="assets/screenshots/discover.png"
    alt="A screenshot of the discover page"
    width="200" />
<img
    src="assets/screenshots/search.png"
    alt="A screenshot of the search interface"
    width="200" />

<img
    src="assets/screenshots/profile.png"
    alt="A screenshot of the profile page"
    width="200" />
<img
    src="assets/screenshots/notifications.png"
    alt="A screenshot of the notifications page"
    width="200" />
<img
    src="assets/screenshots/settings.png"
    alt="A screenshot of the settings page"
    width="200" />
<img
    src="assets/screenshots/direct-messages.png"
    alt="A screenshot of the list of direct message conversations"
    width="200" />
<img
    src="assets/screenshots/conversation.png"
    alt="A screenshot of a conversation over direct messaging"
    width="200" />

## Building

This project is written in React Native and built using Expo. Here are the
steps to build and run it locally:

```
$ npm install -g expo-cli # You'll need this to work with Expo projects
$ git clone https://github.com/natjms/resin # Clone the repository
$ npm install # Install the dependencies
$ expo start # start the development server
```

## Contributing

### Bug testing
As Resin enters it's beta phase, we're looking for help from bug testers! You
can test it out without running a development server by downloading the
[Expo Go](https://expo.dev/client) app and scanning the following QR code on
your phone:

<img
    src="assets/build-qr-code.png"
    alt="The QR code of the link to the v1.0-beta build of Resin"
    style="margin-left: auto; margin-right: auto; width: 150px"/>

When you run into a bug, hop on over to the [issues page](https://github.com/natjms/resin/issues) and create a new issue. Make sure you fill out as much of the template as possible to help us determine how to best approach fixing the problem. If you're not comfortable with GitHub, you're welcome to [contact the project maintainer](https://social.njms.ca/nat), however bug tracking through GitHub Issues is greatly preferred and there's no guarantee we'll see your message if you try to send it through another channel.

#### A note on current limitations
Note that there are a number of issues with this app related to Pixelfed API endpoints that haven't been exposed yet. These are problems that cannot be fixed on our end, but are currently being worked on by the Pixelfed team. Until these endpoints are exposed, a number of features, including the likes of bookmarks, direct messages and updating your profile won't work and using these interfaces may have some unintended side effects. For more information and for a full list of these limitations, check [this list of issues labeled wontfix](https://github.com/natjms/resin/issues?q=is%3Aopen+is%3Aissue+label%3Awontfix).

#### A note for iOS folks
One of Resin's original goals was to create a Pixelfed client that could be
used on both Android and iOS--something that's somewhat lacking among
Fediverse clients. Unfortunately, due to our lacking access to Apple products,
Resin hasn't formally been tested on iOS.

It's very possible that, should you open it on your iPhone, it'll literally do
nothing. If that doesn't happen, then there's a good chance that there may be
some major issues preventing it from being used. In this case, if you're an iOS
user, have some familiarity with React Native and/or JavaScript and have some
free time to spare, we'd love to have your help in making Resin on iOS a
reality. Otherwise, there's a good chance it'll be a while before Resin is
available on the App Store.

### Contributing code

We're always welcoming new contributors! To start contributing code, feel free
to check out the issues tab. Easy issues are labeled
[good first issue](https://github.com/natjms/resin/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22),
but don't let that limit you if you feel confident with React Native and
JavaScript. If you see an issue hasn't been assigned to anyone, that means no
one's working on it. Drop a reply saying you'd be interested in helping out and
it's all yours.

### Other ways to help out

Resin isn't officially set up to handle translations yet, but that'll be coming
in the near future. There are many ways to help out with a project like this
besides contributing code, from bug testing, to writing and more. Even then, a
lot of the work is more on the philosophical side, in deconstructing the
interfaces of apps like Instagram to best determine how to make Resin as
nonaddictive as possible without making it painful to use.

If you're not sure where to get started, feel free to contact
[the project maintainer](https://social.njms.ca/nat) who would be more than
happy to hear from you.
