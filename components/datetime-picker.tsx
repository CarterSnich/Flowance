import { useThemeColor } from "@/hooks/use-theme-color";
import { formatDate } from "@/lib/utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Button } from "./button";
import { Text } from "./text";

type DateTimePickerMode = "date" | "time";

type Props = {
  value?: Date;
  onChange?: (selectedDate: Date) => void;
  mode: DateTimePickerMode;
};

function DateTimePicker({ ...props }: Props) {
  const textColor = useThemeColor({}, "text");

  const [value, setValue] = useState<Date>(
    props.value ? props.value : new Date()
  );

  function onChange(event: DateTimePickerEvent, selectedDate?: Date) {
    if (selectedDate !== undefined) {
      setValue(selectedDate);
      props.onChange?.(selectedDate);
    }
  }

  function pickDate(mode: DateTimePickerMode) {
    DateTimePickerAndroid.open({
      value,
      onChange,
      mode,
      is24Hour: false,
    });
  }

  return (
    <Button style={styles.button} onPress={() => pickDate(props.mode)}>
      <MaterialIcons name="calendar-month" size={24} color={textColor} />
      <Text>{formatDate(value)}</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "space-between",
    flexDirection: "row",
    gap: 8,
  },
});

export { DateTimePicker };
