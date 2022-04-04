import React, { useMemo } from "react";
import { Text, Pressable,StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated from 'react-native-reanimated';

interface NotificationDeepLink {
    path: string;
    payload: string;
}
interface FloatNotificationDataContent {
    //@ts-ignore
    title: string;
    subtitle?: string;
    //@ts-ignore
    body:string;
    cover: string;
    time:string;
    deeplink?: NotificationDeepLink
}
export interface FloatNotificationData {
    content: FloatNotificationDataContent;
}

const FloatNotification = React.memo((props: {
    isCloseRequested: boolean;
    onCloseCompleted: any;
    close: any;
}) => {
    const insets = useSafeAreaInsets();
    const dimens = useWindowDimensions();

    const onPressClose = () => {
        if (close) close();
    };

    return (
        <Animated.View style={[styles.default_notification_view, {
            width: dimens.width * 0.92,
            minHeight: 50,
            alignSelf: "center",
            position: "absolute",
            top: insets.top
        }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8 }}>
                <View style={{ height: 22, width: 22, borderRadius: 6, backgroundColor: '#f1f1f1' }}>
                </View>
                <Text style={styles.time}>现在</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                    <Text numberOfLines={1} style={styles.title}>这是标题</Text>
                    <Text numberOfLines={2} style={[styles.body]}>{"这里是通知正文"}</Text>
                </View>
                <View style={{ height: 40, width: 40, borderRadius: 5, backgroundColor: '#f1f1f1' }}></View>
            </View>
        </Animated.View>
    );
});

export default FloatNotification;



const styles = StyleSheet.create({
    default_notification_view: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
        textAlign: "center",
        backgroundColor: "#FFF",
        shadowColor: "#000000",
        shadowRadius: 10,
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 3 }
    },
    title: {
        fontSize: font(16),
        color: '#121212'
    },
    body: {
        fontSize: font(15),
        color: '#767676',
        marginTop: 3,
        lineHeight: font(19)
    },
    time: {
        fontSize: font(13),
        color: '#767676'
    }
});
