import React, { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { PowpowFloat } from "./FloatCentral";

const ModalView = React.memo((props: {
    children: any;
    zIndex: number;
    animation?: "opacity" | "none";
    onDidShow?: () => void;
    onDidHide?: () => void;
}) => {
    const { children, zIndex, onDidShow, onDidHide, animation = "none" } = props;
    useEffect(() => {
        if (onDidShow) onDidShow();
        return () => {
            if (onDidHide) onDidHide();
        }
    }, [])
    return (
        <Animated.View
            entering={animation == "none" ? undefined : FadeIn}
            exiting={animation == "none" ? undefined : FadeOut}
            style={[StyleSheet.absoluteFill, { zIndex, flex: 1 }]}>
            {children}
        </Animated.View>
    )
})

const FloatModal = React.memo((props: {
    visible: boolean;
    children?: any;
    zIndex?: number;
    animation?: "opacity" | "none";
    onDidShow?: () => void;
    onDidHide?: () => void;
}) => {

    const { children, zIndex = 10000, visible, onDidShow, onDidHide, animation } = props;
    const key = useRef(PowpowFloat.uuid()).current;

    useEffect(() => {
        if (visible) {
            let float: PowpowFloat.Float = {
                key: key,
                component: (props) => (
                    <ModalView
                        children={children}
                        zIndex={zIndex}
                        onDidHide={onDidHide}
                        onDidShow={onDidShow}
                        animation={animation}
                    />
                )
            }
            global.makeFloat(float, false)
        } else {
            global.makeFloat({ key }, true)
        }
    }, [visible])

    return <></>
});

export default FloatModal;