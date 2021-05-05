import AsyncStorage from "@react-native-async-storage/async-storage";

const TEST_NOTIFICATIONS = [{ id: 1 }, { id: 2 }];
const TEST_NEW_NOTIFICATIONS_1 = [{ id: 1 }, { id: 2 }];
const TEST_NEW_NOTIFICATIONS_2 = [{ id: 1 }, { id: 2 }, { id: 3 }];

function objectToForm(obj) {
    let form = new FormData();

    Object.keys(obj).forEach(key =>
        form.append(key, obj[key])
    );

    return form;
}

export async function checkUnreadNotifications() {
    // If the check has already been made since the last time notifications.js
    // has been opened
    const notifications = JSON.parse(await AsyncStorage.getItem("@user_notifications"));

    if (notifications.unread) {
        return true;
    } else {
        // Some promise to get new notifications
        const newNotifs = await Promise.resolve(TEST_NEW_NOTIFICATIONS_2);

        const isUnread = JSON.stringify(newNotifs) != JSON.stringify(notifications.memory);

        // Update stored notifications
        await AsyncStorage.setItem(
            "@user_notifications",
            JSON.stringify({...notifications,
                unread: isUnread,
            })
        );

        return isUnread;
    }
}

export async function postForm(url, data, token = false) {
    // Send a POST request with data formatted with FormData returning JSON
    const resp = await fetch(url, {
        method: "POST",
        body: objectToForm(data),
        headers: token
            ? { "Authorization": `Bearer ${token}`, }
            : {},
    });

    return resp;
}

export async function get(url, token = false, data = false) {
    let completeURL;
    if (data) {
        let params = new URLSearchParams(data)
        completeURL = `${url}?${params.toString()}`;
    } else {
        completeURL = url;
    }

    const resp = await fetch(completeURL, {
        method: "GET",
        headers: token
            ? { "Authorization": `Bearer ${token}`, }
            : {},
    });

    return resp;
}

export async function fetchProfile(domain, id) {
    const resp = await get(`https://${domain}/api/v1/accounts/${id}`);
    return resp.json();
}

export async function fetchAccountStatuses(domain, id, token) {
    const resp = await get(`https://${domain}/api/v1/accounts/${id}/statuses`, token);
    return resp.json();
}

export async function fetchFollowing(domain, id, token) {
    const resp = await get(`https://${domain}/api/v1/accounts/${id}/following`, token);
    return resp.json();
}

export async function fetchFollowers(domain, id, token) {
    const resp = await get(`https://${domain}/api/v1/accounts/${id}/followers`, token);
    return resp.json();
}

export async function fetchHomeTimeline(domain, token, params = false) {
    const resp = await get(
        `https://${domain}/api/v1/timelines/home`,
        token,
        params
    );
    return resp.json();
}
