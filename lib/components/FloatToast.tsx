import React, { useEffect, useMemo } from "react";
import { Text, Pressable, useWindowDimensions, ViewStyle, TextStyle } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export interface FloatToastData {
    text: string;
    duration?: "short" | "long";
    position?: "top" | "center" | "bottom";
}
const FloatToast = React.memo((props: {
    data: FloatToastData;
    removeSelf: () => void;
    style?: ViewStyle;
    labelStyle?: TextStyle;
}) => {
    const { data, style, removeSelf, labelStyle } = props;
    const dimens = useWindowDimensions();
    const areaPosition = useMemo(() => ({
        top: Math.floor(dimens.height * 0.33 * 0.5),
        center: Math.floor(dimens.height * 0.5) - 20,
        bottom: Math.floor(dimens.height * (1 - 0.33 * 0.5))
    }), [dimens]);
    const maxWidth = useMemo(() => Math.min(dimens.width, dimens.height) * 0.5, [dimens])

    const containerStyle: ViewStyle = {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: 'center',
        position: "absolute",
        zIndex: 99999,
        top: areaPosition[data?.position ?? "center"]
    };

    useEffect(() => {
        setTimeout(() => {
            removeSelf()
        }, (data.duration ?? "short") == "short" ? 2000 : 3500);
    }, [])

    return (
        <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={[containerStyle, { maxWidth: maxWidth, backgroundColor: '#000' }, style]}>
            <Text style={[{ fontSize: font(15.6), color: '#FFF' }, labelStyle]}>{data?.text ?? ''}</Text>
        </Animated.View>
    );
});
export default FloatToast;
