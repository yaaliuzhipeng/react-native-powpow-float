import React, { useEffect, useMemo } from "react";
import { Text, Pressable, View, Dimensions, ViewStyle, TextStyle, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
const { width: iww, height: iwh } = Dimensions.get('window')
const WindowWidth = Math.min(iww, iwh);
const WindowHeight = Math.max(iww, iwh);
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
    const dms = useWindowDimensions();
    const windowHeight = useMemo(() => dms.height, [dms])
    const areaPosition = useMemo(() => ({
        top: Math.floor(windowHeight * 0.33 * 0.5),
        center: Math.floor(windowHeight * 0.5) - 20,
        bottom: Math.floor(windowHeight * (1 - 0.33 * 0.5))
    }), []);
    const maxWidth = useMemo(() => Math.min(WindowWidth, WindowHeight) * 0.6, [])

    const containerStyle: ViewStyle = useMemo(() => ({
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: 'center',
        position: "absolute",
        zIndex: 99999,
        top: areaPosition[data?.position ?? "center"]
    }), [data]);

    useEffect(() => {
        const tt = setTimeout(() => {
            removeSelf()
        }, (data.duration ?? "short") == "short" ? 2000 : 3500);
        return () => {
            clearTimeout(tt);
        }
    }, [])

    return (
        <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={[
                containerStyle,
                { maxWidth: maxWidth, backgroundColor: '#000000CC' },
                style
            ]}>
            <Text style={[{ fontSize: font(15.6), color: '#FFF' }, labelStyle]}>{data?.text ?? ''}</Text>
        </Animated.View>
    );
});
export default FloatToast;
