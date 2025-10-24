import { useThemeColor } from "@/hooks/use-theme-color";
import {
  Switch as RNSwitch,
  StyleSheet,
  SwitchProps,
  View,
} from "react-native";
import { Text } from "./text";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {},
  switch: {},
});

function Switch({ ...props }: SwitchProps) {
  const thumbColor = useThemeColor({}, "tint");
  const trackColor = useThemeColor({}, "secondaryBackground");

  return (
    <RNSwitch
      thumbColor={thumbColor}
      trackColor={{
        true: trackColor,
        false: trackColor,
      }}
      {...props}
    />
  );
}

type LabeledSwitchProps = SwitchProps & {
  label: string;
};

function LabeledSwitch({ ...props }: LabeledSwitchProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.container}>{props.label}</Text>
      <Switch {...props} style={[styles.switch, props.style]} />
    </View>
  );
}

export { LabeledSwitch, Switch };
