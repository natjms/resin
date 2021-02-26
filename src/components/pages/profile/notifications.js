import React, { useState } from "react";
import { ScreenWithTrayJsx } from "src/components/navigation/navigators";

const NotificationsJsx = ({navigation}) => {
    return (
        <ScreenWithTrayJsx
             active = "Notifications"
             navigation = { navigation }>
            
        </ScreenWithTrayJsx>
    );
}

export default NotificationsJsx;