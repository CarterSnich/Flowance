import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { DateTimePicker } from "../datetime-picker";
import { Modal } from "../modal";
import { LabeledSwitch } from "../switch";
import { Text } from "../text";
import { TextInput } from "../text-input";

type Props = {
  title: string;
  visible: boolean;
  onSubmit: (
    date: Date,
    amount: number,
    isExpense: boolean,
    note: string
  ) => void;
  onCancel: () => void;
};

function AddTransactionModal({ title, visible, onSubmit, onCancel }: Props) {
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState(0);
  const [isExpense, setIsExpense] = useState<boolean>(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    setDate(new Date());
    setAmount(0);
    setIsExpense(false);
    setNote("");
  }, [visible]);

  return (
    <Modal
      visible={visible}
      title={title}
      buttons={[
        {
          label: "Submit",
          action: () => onSubmit(date, amount, isExpense, note),
        },
        {
          label: "Cancel",
          action: onCancel,
        },
      ]}
    >
      <View style={styles.form}>
        <View>
          <Text>Date </Text>
          <DateTimePicker value={date} onChange={setDate} mode={"date"} />
        </View>
        <View>
          <Text>Amount</Text>
          <TextInput
            keyboardType="number-pad"
            value={amount.toString()}
            onChangeText={(text) => {
              const num = Number(text);
              if (isNaN(num)) {
                setAmount(amount);
              } else {
                setAmount(num);
              }
            }}
          />
          <LabeledSwitch
            label="Expense"
            value={isExpense}
            onValueChange={(value) => setIsExpense(value)}
          />
        </View>
        <View>
          <Text>Note</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            numberOfLines={3}
            multiline
            inputMode="text"
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

export { AddTransactionModal };
