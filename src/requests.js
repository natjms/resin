import AsyncStorage from "@react-native-async-storage/async-storage";

const TEST_NOTIFICATIONS = [{ id: 1 }, { id: 2 }];
const TEST_NEW_NOTIFICATIONS_1 = [{ id: 1 }, { id: 2 }];
const TEST_NEW_NOTIFICATIONS_2 = [{ id: 1 }, { id: 2 }, { id: 3 }];

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

        console.log(JSON.stringify(newNotifs));
        console.log(JSON.stringify(notifications.memory));

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
