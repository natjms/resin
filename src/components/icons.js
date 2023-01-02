import React from "react";
import { Image, StyleSheet } from "react-native";

/* React doesn't allow you to `require` images dynamically because they need
 * to be known ahead of time. As such, we require all the icons we'll need in
 * this map. If a new icon is added, then it must be added to this array
 */
const images = {
  ellipsis: {
    black: require("assets/icons/ellipsis-black-64px.png"),
  },
  feed: {
    black: require("assets/icons/feed-black-64px.png"),
    grey: require("assets/icons/feed-grey-64px.png"),
  },
  search: {
    black: require("assets/icons/search-black-64px.png"),
    grey: require("assets/icons/search-grey-64px.png"),
  },
  camera: {
    black: require("assets/icons/camera-black-64px.png"),
    grey: require("assets/icons/camera-grey-64px.png"),
  },
  mail: {
    black: require("assets/icons/mail-black-64px.png"),
    grey: require("assets/icons/mail-grey-64px.png"),
  },
  person: {
    black: require("assets/icons/person-black-64px.png"),
    grey: require("assets/icons/person-grey-64px.png"),
  },
  hashtag: {
    black: require("assets/icons/hashtag-black-64px.png"),
    grey: require("assets/icons/hashtag-grey-64px.png"),
  },
  planet: {
    black: require("assets/icons/planet-black-64px.png"),
    grey: require("assets/icons/planet-grey-64px.png"),
  },
  square: {
    black: require("assets/icons/square-black-64px.png"),
  },
  checkbox: {
    black: require("assets/icons/checkbox-black-64px.png"),
  },
  "lock-closed": {
    black: require("assets/icons/lock-closed-black-64px.png"),
    grey: require("assets/icons/lock-closed-grey-64px.png"),
  },
  "lock-open": {
    black: require("assets/icons/lock-open-black-64px.png"),
    grey: require("assets/icons/lock-open-grey-64px.png"),
  },
  heart: {
    black: require("assets/icons/heart-black-64px.png"),
    grey: require("assets/icons/heart-grey-64px.png"),
  },
  bookmark: {
    black: require("assets/icons/bookmark-black-64px.png"),
    grey: require("assets/icons/bookmark-grey-64px.png"),
  },
  boost: {
    black: require("assets/icons/boost-black-64px.png"),
    grey: require("assets/icons/boost-grey-64px.png"),
  },
  create: {
    black: require("assets/icons/create-black-64px.png"),
  },
  close: {
    black: require("assets/icons/close-black-64px.png"),
  },
};

const Icon = ({name, size, focused = true}) => {
  if (images[name] === undefined) {
    console.error(`Icon "${name}" is not recognized`);
    return <></>;
  }

  // Warn the programmer if their chosen icon colour hasn't been rendered
  if (focused && images[name].black === undefined) {
    console.error(`There exists no focused version of icon "${name}"`);
    return <></>;
  }

  if (!focused && images[name].grey === undefined) {
    console.error(`There exists no unfocused version of icon "${name}"`);
    return <></>;
  }

  const styles = StyleSheet.create({
    image: {
      width: size,
      height: size,
    },
  });

  return <Image
    style = { styles.image }
    source = {images[name][focused ? "black" : "grey"]}/>;
};

export default Icon;
