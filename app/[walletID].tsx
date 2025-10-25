import { Pressable } from "@/components/pressable";
import { Separator } from "@/components/separator";
import { Text } from "@/components/text";
import { ViewTransactionModal } from "@/components/ui/view-transaction-modal";
import { formatCurreny, formatDate } from "@/lib/utils";
import { Transaction } from "@/models/Transaction";
import { Wallet } from "@/models/Wallet";
import * as Database from "@/services/database";
import { Stack } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, ToastAndroid, View } from "react-native";

function WalletTransactionsScreen() {
  const db = useSQLiteContext();
  const { walletID } = useLocalSearchParams<{ walletID: string }>();

  const [wallet, setWallet] = useState<Wallet>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction>();

  useEffect(() => {
    (async () => {
      try {
        const wallet = await Database.getWallet(db, Number(walletID));
        if (wallet === null) {
          ToastAndroid.show("Wallet not found.", ToastAndroid.SHORT);
          return;
        }

        const transactions = await Database.getTransactions(db, wallet?.id);
        setWallet(wallet);
        setTransactions(transactions);
      } catch (error) {
        console.error(error);
        ToastAndroid.show(
          "Failed to get wallet transactions.",
          ToastAndroid.SHORT
        );
      }
    })();
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerTitle: `${wallet?.name} wallet` }} />
      <View style={styles.container}>
        <FlatList
          style={styles.flatList}
          data={transactions}
          renderItem={({ item: t, index }) => (
            <Pressable
              key={index}
              style={styles.listItem}
              onPress={() => setSelectedTransaction(t)}
            >
              <View style={styles.listItemTitle}>
                <Text type="subtitle">
                  {t.amount > 0 ? "Income" : "Expense"}
                </Text>
                <Text type="subtitle">{formatCurreny(t.amount)}</Text>
              </View>
              <Text>{formatDate(t.date)}</Text>
            </Pressable>
          )}
          ItemSeparatorComponent={Separator}
        />
      </View>

      <ViewTransactionModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(undefined)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  flatList: {
    flex: 1,
  },

  listItem: {
    padding: 16,
  },
  listItemTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default WalletTransactionsScreen;
