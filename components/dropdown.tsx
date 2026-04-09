import { useThemeColor } from "@/hooks/use-theme-color";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { Text } from "./text";

type Props<T> = {
  items: T[];
  initialIndex?: number;
  onItemChange?: () => void;
  labelExtractor: (item: T) => string;
};

function Dropdown<T>({ ...props }: Props<T>) {
  const tintColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor({}, "border");
  const iconColor = useThemeColor({}, "icon");

  const [isVisible, setVisibility] = useState(false);
  const [currentItem, setCurrentItem] = useState<T>();

  const [layout, setLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>();

  function onPressItem(index: number) {
    setCurrentItem(props.items[index]);
    setVisibility(false);
  }

  useEffect(() => {
    if (props.items.length) {
      setCurrentItem(props.items[props.initialIndex ?? 0]);
    }
  }, [props.items]);

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.pressable, { backgroundColor: tintColor, borderColor }]}
        onPress={() => setVisibility(!isVisible)}
        onLayout={(e) =>
          e.target.measureInWindow((x, y, width, height) =>
            setLayout({ x, y, width, height })
          )
        }>
        <View>
          <Text>{currentItem && props.labelExtractor(currentItem)}</Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-down"
          color={iconColor}
          size={24}
        />
      </Pressable>

      <Modal visible={isVisible} transparent animationType="fade">
        <Pressable
          style={styles.dropdownBackdrop}
          onPress={() => setVisibility(false)}>
          <View
            style={[
              styles.dropdown,
              {
                width: layout?.width,
                top: layout ? layout?.y + layout?.height : 0,
                left: layout?.x,
              },
            ]}>
            {props.items.map((item, index) => (
              <Pressable
                key={index}
                style={styles.dropDownItem}
                onPress={() => onPressItem(index)}>
                <Text>{props.labelExtractor(item)}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  pressable: {
    borderWidth: StyleSheet.hairlineWidth * 4,
    padding: 16,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownBackdrop: {
    height: "100%",
    position: "relative",
  },
  dropdown: {
    position: "fixed",
    marginTop: 8,
    borderColor: "white",
    borderWidth: StyleSheet.hairlineWidth * 4,
    backgroundColor: "#555555",
    gap: StyleSheet.hairlineWidth * 2,
  },
  dropDownItem: {
    padding: 12,
    backgroundColor: "black",
  },
});

export default Dropdown;
