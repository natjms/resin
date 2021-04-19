import React from "react";
import { View, StatusBar } from "react-native";

export function StatusBarSpace(props) {
    return <View style = {
        {
            height: StatusBar.currentHeight,
            backgroundColor: props.color ? props.color : "transparent",
        }
    }></View>;
};

export function withoutHTML(string) {
    return string.replace(/<[^>]*>/ig, "");
}

export function pluralize(n, singular, plural) {
    if (n < 2) {
        return singular;
    } else {
        return plural;
    }
}

export function timeToAge(time1, time2) {
    /*
    Output a friendly string to describe the age of a post, where `time1` and
    `time2` are in milliseconds
    */

    const between = (n, lower, upper) => n >= lower && n < upper;

    const diff = time1 - time2;

    if (diff < 60000) {
        return "Seconds ago"
    } else if (between(diff, 60000, 3600000)) {
        const nMin = Math.floor(diff / 60000);
        return nMin + " " + pluralize(nMin, "minute", "minutes") + " ago";
    } else if (between(diff, 3600000, 86400000)) {
        const nHours = Math.floor(diff / 3600000);
        return nHours + " " + pluralize(nHours, "hour", "hours") + " ago";
    } else if (between(diff, 86400000, 2629800000)) {
        const nDays = Math.floor(diff / 86400000);
        return nDays + " " + pluralize(nDays, "day", "days") + " ago";
    } else if (between(diff, 2629800000, 31557600000)) {
        const nMonths = Math.floor(diff / 2629800000);
        return nMonths + " " + pluralize(nMonths, "month", "months") + " ago";
    } else {
        const nYears = Math.floor(diff / 31557600000);
        return nYears + " " + pluralize(nYears, "year", "years") + " ago";
    }
}
