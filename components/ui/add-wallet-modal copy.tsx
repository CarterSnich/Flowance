import { Modal, ModalProps } from "@/components/modal";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../text";
import { TextInput } from "../text-input";

type Props = ModalProps & {
  visible: boolean;
  onSubmit?: (walletName: string, balance: number) => void;
  onCancel?: () => void;
};

function AddWalletModal({ visible, onSubmit, onCancel }: Props) {
  const [walletName, setWalletName] = useState("");
  const [balance, setBalance] = useState(0);

  return (
    <Modal
      visible={visible}
      title="Add wallet"
      buttons={[
        {
          label: "Submit",
          action: () => onSubmit?.(walletName, balance),
        },
        {
          label: "Cancel",
          action: () => onCancel?.(),
        },
      ]}>
      <View style={styles.form}>
        <View>
          <Text>Wallet name</Text>
          <TextInput value={walletName} onChangeText={setWalletName} />
        </View>
        <View>
          <Text>Initial balance</Text>
          <TextInput
            keyboardType="number-pad"
            value={balance.toString()}
            onChangeText={(text) => {
              const num = Number(text);
              if (isNaN(num)) {
                setBalance(balance);
              } else {
                setBalance(num);
              }
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
});

export default AddWalletModal;
