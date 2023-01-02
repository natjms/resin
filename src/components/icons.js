import React from "react";
import { Image, StyleSheet } from "react-native";

/* React doesn't allow you to `require` images dynamically because they need
 * to be known ahead of time. As such, we require all the icons we'll need in
 * this map. If a new icon is added, then it must be added to this array
 */
const images = {
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
};

const Icon = ({name, size, focused = true}) => {
  if (images[name] === undefined) {
    console.error(`Icon "${name}" is not recognized`);
    return <></>
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
