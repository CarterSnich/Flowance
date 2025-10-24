import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { PressableProps, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Pressable } from "./pressable";
import { Text } from "./text";

type Props = PressableProps & {
  children?: React.ReactNode | string;
  transparent?: boolean;
  style?: StyleProp<ViewStyle>;
};

function Button({ ...props }: Props) {
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");

  return (
    <Pressable
      {...props}
      style={[
        styles.button,
        { backgroundColor: props.transparent ? "transparent" : tintColor },
        props.style,
      ]}
    >
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
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  text: {
    textAlign: "center",
  },
});

export { Button };
