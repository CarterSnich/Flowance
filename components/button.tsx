import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { Text } from "./text";

type Props = PressableProps & {
  children?: React.ReactNode | string;
  transparent?: boolean;
  style?: StyleProp<ViewStyle>;
};

function Button({ ...props }: Props) {
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "border");

  return (
    <Pressable
      {...props}
      style={[
        styles.button,
        { borderColor: borderColor, backgroundColor: tintColor },
        props.style,
      ]}>
      {props.children &&
        (typeof props.children === "string" ? (
          <Text style={[styles.text, { color: textColor }]}>
            {props.children}
          </Text>
        ) : (
          props.children
        ))}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 46,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 2,
  },
  text: {
    textAlign: "center",
  },
});

export { Button };
