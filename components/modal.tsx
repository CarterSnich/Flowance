import { Pressable } from "@/components/pressable";
import { Text } from "@/components/text";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import {
  Modal as RNM,
  ModalProps as RNMP,
  StyleSheet,
  View,
} from "react-native";

type ModalButton = {
  label: string;
  action: () => any;
};

type ModalProps = RNMP & {
  title?: string;
  children?: React.ReactNode | string;
  buttons?: ModalButton[];
};

function Modal({ ...props }: ModalProps) {
  const bgColor = useThemeColor({}, "background");

  return (
    <RNM visible={props.visible} transparent animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalDialog, { backgroundColor: bgColor }]}>
          {props.title && (
            <Text type="subtitle" style={styles.modalHeader}>
              {props.title}
            </Text>
          )}
          <View style={styles.modalBody}>{props.children}</View>
          <View style={styles.modalFooter}>
            {props.buttons?.map((btn, index) => (
              <Pressable
                key={index}
                style={styles.modalButtons}
                onPress={btn.action}
              >
                <Text>{btn.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </RNM>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000a0",
  },
  modalDialog: {
    maxWidth: 360,
    width: "90%",
    padding: 16,
    borderRadius: 8,
    gap: 16,
  },
  modalHeader: {},
  modalBody: {},
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  modalButtons: { padding: 8 },
});

export { Modal, ModalButton, ModalProps };
