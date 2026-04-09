import {
  PressableAndroidRippleConfig,
  PressableProps,
  Pressable as RNPressable,
} from "react-native";

function Pressable({ ...props }: PressableProps) {
  const rippleConfig: PressableAndroidRippleConfig = {
    color: "grey",
    foreground: true,
  };

  return <RNPressable android_ripple={rippleConfig} {...props} />;
}

export { Pressable };
