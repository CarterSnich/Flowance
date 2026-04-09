import { useThemeColor } from "@/hooks/use-theme-color";
import { Transaction } from "@/models/Transaction";
import { formatCurreny, formatDate } from "@/utils/utils";
import { StyleSheet, View } from "react-native";
import { Modal } from "../modal";
import { Text } from "../text";

type Props = {
  transaction?: Transaction;
  onClose: () => void;
};

function ViewTransactionModal({ transaction, onClose }: Props) {
  const noteBgColor = useThemeColor(
    {
      light: "#cececeff",
      dark: "#303030ff",
    },
    "background"
  );

  return (
    <Modal
      title={transaction && `${transaction?.amount > 0 ? "Income" : "Expense"}`}
      visible={transaction !== undefined}
      buttons={[
        {
          label: "Close",
          action: onClose,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Text type="defaultSemiBold">Date</Text>
          <Text>{transaction && formatDate(transaction.date)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text type="defaultSemiBold">Amount</Text>
          <Text>{transaction && formatCurreny(transaction.amount)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text type="defaultSemiBold">Balance before</Text>
          <Text>{transaction && formatCurreny(transaction.balanceBefore)}</Text>
        </View>
        {transaction?.note.length && (
          <View>
            <Text type="defaultSemiBold">Note</Text>
            <Text style={[styles.note, { backgroundColor: noteBgColor }]}>
              {transaction && transaction.note}
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  note: {
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
  },
});

export { ViewTransactionModal };
