import { Pressable } from "@/components/pressable";
import { Text } from "@/components/text";
import { useDatabaseContext } from "@/contexts/database";
import { Transaction } from "@/models/Transaction";
import { Wallet } from "@/models/Wallet";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

function IndexScreen() {
  const Database = useDatabaseContext();
  useDrizzleStudio(Database.db);

  const [refreshing, setRefreshing] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);

  const [viewingWallet, setViewableWallet] = useState<Wallet>();
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );

  async function getWallets() {
    const wallets = await Database.getWallets();
    if (wallets.length) {
      setViewableWallet(wallets[0]);
      setWallets(wallets);
      await Database.getTransactions(wallets[0].id);
    }
  }

  useEffect(() => {
    getWallets();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Flowance",
          headerRight: () => (
            <Pressable
              android_ripple={{ foreground: true, color: "grey" }}
              style={{ padding: 8, alignItems: "center" }}>
              <Text>Add wallet</Text>
            </Pressable>
          ),
        }}
      />

      <View style={styles.container}></View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default IndexScreen;
