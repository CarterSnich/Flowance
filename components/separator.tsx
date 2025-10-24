import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  horizontal: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
  },
  vertical: {
    height: "100%",
    width: StyleSheet.hairlineWidth,
  },
});

type Props = {
  vertical?: boolean;
  color?: string;
};

function Separator({ vertical = false, color }: Props) {
  const bgColor = color === undefined ? useThemeColor({}, "text") : color;

  return (
    <View
      style={[
        vertical ? styles.vertical : styles.horizontal,
        { backgroundColor: bgColor },
      ]}
    />
  );
}

export { Separator };
