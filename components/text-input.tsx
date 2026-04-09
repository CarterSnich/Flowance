import { useThemeColor } from "@/hooks/use-theme-color";
import {
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";

const styles = StyleSheet.create({
  textInput: {
    height: 46,
    padding: 0,
    fontSize: 16,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderRadius: 8,
  },
  oneline: {
    paddingHorizontal: 16,
  },
  multiline: {
    alignItems: "baseline",
    height: 100,
    padding: 16,
  },
});

function TextInput({ ...props }: TextInputProps) {
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");

  return (
    <RNTextInput
      style={[
        styles.textInput,
        { color: textColor, borderColor: tintColor },
        props.style,
        props.multiline ? styles.multiline : styles.oneline,
      ]}
      {...props}
    />
  );
}

export { TextInput };
