import AsyncStorage from "@react-native-async-storage/async-storage";

const TEST_NOTIFICATIONS = [{ id: 1 }, { id: 2 }];
const TEST_NEW_NOTIFICATIONS_1 = [{ id: 1 }, { id: 2 }];
const TEST_NEW_NOTIFICATIONS_2 = [{ id: 1 }, { id: 2 }, { id: 3 }];

export function objectToForm(obj) {
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

export async function postForm(url, data = false, token = false, contentType = false) {
    // Send a POST request with data formatted with FormData returning JSON
    let headers = {};

    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (contentType) headers["Content-Type"] = contentType;

    const resp = await fetch(url, {
        method: "POST",
        body: data ? objectToForm(data) : undefined,
        headers,
    });

    return resp;
}

export async function post(url, token = false) {
    const resp = await fetch(url, {
        method: "POST",
        headers: token
            ? { "Authorization": `Bearer ${token}`, }
            : {},
    });

    return resp;
}

export async function get(url, token = false, data = false) {
    let completeURL;
    if (data) {
        let params = new URLSearchParams(data);
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

export async function _delete(url, token = false) {
    const resp = await fetch(url, {
        method: "DELETE",
        headers: token
            ? { "Authorization": `Bearer ${token}`, }
            : {},
    });

    return resp;
}

export async function verifyCredentials(domain, token) {
    const resp = await get(
        `https://${domain}/api/v1/accounts/verify_credentials`,
        token
    );
    return resp.json();
}

export async function fetchProfile(domain, id, token) {
    const resp = await get(`https://${domain}/api/v1/accounts/${id}`, token);
    return resp.json();
}

export async function fetchAccountStatuses(domain, id, token) {
    const resp = await get(`https://${domain}/api/v1/accounts/${id}/statuses`, token);
    return resp.json();
}

export async function muteAccount(domain, id, token, params = false) {
    const resp = await postForm(`https://${domain}/api/v1/accounts/${id}/mute`, params, token);
    return resp.json();
}

export async function unmuteAccount(domain, id, token) {
    const resp = await post(`https://${domain}/api/v1/accounts/${id}/unmute`, token);
    return resp.json();
}

export async function blockAccount(domain, id, token) {
    const resp = await post(`https://${domain}/api/v1/accounts/${id}/block`, token);
    return resp.json();
}

export async function unblockAccount(domain, id, token) {
    const resp = await post(`https://${domain}/api/v1/accounts/${id}/unblock`, token);
    return resp.json();
}

export async function publishMediaAttachment(domain, token, params) {
    const resp = await postForm(`https://${domain}/api/v1/media`, params, token, "multipart/form-data");
    return resp.json();
}

export async function publishStatus(domain, token, params) {
    const resp = await postForm(`https://${domain}/api/v1/statuses`, params, token);
    return resp.json();
}

export async function deleteStatus(domain, id, token) {
    const resp = await _delete(`https://${domain}/api/v1/statuses/${id}`, token);
    return resp.json();
}

export async function fetchStatusContext(domain, id, token) {
    const resp = await get(`https://${domain}/api/v1/statuses/${id}/context`, token);
    return resp.json();
}

export async function favouriteStatus(domain, id, token) {
    const resp = await post(`https://${domain}/api/v1/statuses/${id}/favourite`, token);
    return resp.json();
}

export async function unfavouriteStatus(domain, id, token) {
    const resp = await post(`https://${domain}/api/v1/statuses/${id}/unfavourite`, token);
    return resp.json();
}

export async function reblogStatus(domain, id, token) {
    const resp = await post(`https://${domain}/api/v1/statuses/${id}/reblog`, token);
    return resp.json();
}

export async function unreblogStatus(domain, id, token) {
    const resp = await post(`https://${domain}/api/v1/statuses/${id}/unreblog`, token);
    return resp.json();
}

export async function bookmarkStatus(domain, id, token) {
    const resp = await post(`https://${domain}/api/v1/statuses/${id}/bookmark`, token);
    return resp.json();
}

export async function unbookmarkStatus(domain, id, token) {
    const resp = await post(`https://${domain}/api/v1/statuses/${id}/unbookmark`, token);
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

export async function followAccount(domain, id, token) {
    const resp = await post(`https://${domain}/api/v1/accounts/${id}/follow`, token);
    return resp.json();
}

export async function unfollowAccount(domain, id, token) {
    const resp = await post(`https://${domain}/api/v1/accounts/${id}/unfollow`, token);
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

export async function fetchPublicTimeline(domain, token, params = false) {
    const resp = await get(
        `https://${domain}/api/v1/timelines/public`,
        token,
        params
    );
    return resp.json();
}

export async function fetchHashtagTimeline(domain, hashtag, token, params = false) {
    const resp = await get(
        `https://${domain}/api/v1/timelines/tag/${hashtag}`,
        token,
        params
    );
    return resp.json();
}

export async function fetchConversations(domain, token, params = false) {
    const resp = await get(
        `https://${domain}/api/v1/conversations`,
        token,
        params
    );
    return resp.json();
}

export async function fetchSearchResults(domain, token, params) {
    const resp = await get(
        `https://${domain}/api/v2/search`,
        token,
        params
    );
    return resp.json();
}
