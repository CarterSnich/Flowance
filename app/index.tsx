import { Pressable } from "@/components/pressable";
import { AddTransactionModal } from "@/components/ui/add-transaction-modal";
import AddWalletModal from "@/components/ui/add-wallet-modal";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { useDatabaseContext } from "@/contexts/database";
import { useThemeColor } from "@/hooks/use-theme-color";
import { formatCurreny, formatDate } from "@/lib/utils";
import { Transaction } from "@/models/Transaction";
import { Wallet } from "@/models/Wallet";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import clsx from "clsx";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  ToastAndroid,
  View,
  ViewToken,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function IndexScreen() {
  const Database = useDatabaseContext();
  useDrizzleStudio(Database.db);

  const { window, screen } = {
    window: Dimensions.get("window"),
    screen: Dimensions.get("screen"),
  };

  const bgColor = useThemeColor(
    {
      light: Colors.dark.background,
      dark: Colors.light.background,
    },
    "background"
  );
  const textColor = useThemeColor({}, "text");
  const textColorInverted = useThemeColor(
    {
      light: Colors.dark.text,
      dark: Colors.light.text,
    },
    "text"
  );

  const [refreshing, setRefreshing] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);

  const [viewingWallet, setViewableWallet] = useState<Wallet>();
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );

  const [isTransactionFormVisible, setTransactionFormVisibility] =
    useState(false);
  const [isWalletFormVisible, setWalletFormVisibility] = useState(false);

  async function getWallets() {
    const wallets = await Database.getWallets();
    if (wallets.length) {
      setViewableWallet(wallets[0]);
      setWallets(wallets);
      await getTransactions(wallets[0].id);
    }
  }

  async function getTransactions(walletID: number) {
    if (!viewingWallet) return;
    const transactions = await Database.getTransactions(walletID, "DESC", 10);
    setRecentTransactions(transactions);
  }

  function onWalletsSwipe({
    viewableItems,
    changed,
  }: {
    viewableItems: ViewToken<Wallet>[];
    changed: ViewToken<Wallet>[];
  }) {
    if (!viewableItems.length) return;
    setViewableWallet(viewableItems[0].item);
    getTransactions(viewableItems[0].item.id);
  }

  async function submitWalletForm(walletName: string, balance: number) {
    if (!walletName.length) {
      ToastAndroid.show("Wallet name is required.", ToastAndroid.SHORT);
      return;
    }

    try {
      await Database.createWallet(walletName.trim(), balance);
    } catch (e) {
      console.error(e);
      ToastAndroid.show(`Failed to add wallet.`, ToastAndroid.SHORT);
    } finally {
      setWalletFormVisibility(false);
      getWallets();
    }
  }

  async function sumbmitTransaction(
    date: Date,
    amount: number,
    isExpense: boolean,
    note: string
  ) {
    if (!viewingWallet) return;

    setTransactionFormVisibility(false);

    try {
      await Database.createTransaction(
        date,
        isExpense ? -amount : amount,
        note,
        viewingWallet.id
      );
    } catch (error) {
      ToastAndroid.show(`Failed to record transaction.`, ToastAndroid.SHORT);
    } finally {
      getWallets();
    }
  }

  useEffect(() => {
    getWallets();
  }, []);

  if (!wallets.length) {
    return (
      <View style={styles.containerEmpty}>
        <MaterialCommunityIcons
          name="wallet-bifold"
          size={128}
          color={textColor}
        />
        <Text style={{ fontSize: 24 }}>Add wallet to start</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 light:bg-zinc-300 dark:bg-zinc-900">
      <View className="flex-1">
        <View>
          <FlatList
            data={wallets}
            keyExtractor={({ id }) => id.toString()}
            renderItem={({ item }) => (
              <View className="w-screen p-3 ">
                <View className="dark:bg-neutral-950 p-5 rounded-lg flex-row justify-between">
                  <Text>{item.name}</Text>
                  <View>
                    <Text className="text-right text-xl">
                      {formatCurreny(item.balance)}
                    </Text>
                    <Text className="text-right text-sm">Balance</Text>
                  </View>
                </View>
              </View>
            )}
            horizontal
            pagingEnabled
            onViewableItemsChanged={onWalletsSwipe}
          />
        </View>
        <View className="flex-1 border border-dashed border-x-0">
          {/* Recent transactions */}
          <FlatList
            keyExtractor={(_item, index) => index.toString()}
            data={recentTransactions}
            renderItem={({ item }) => (
              <Pressable className="p-5 flex-row justify-between">
                <View>
                  <Text className="text-lg">
                    {item.amount > 0 ? "Income" : "Expense"}
                  </Text>
                  <Text>{formatDate(item.date)}</Text>
                </View>
                <Text
                  className={clsx(
                    "text-lg",
                    item.amount > 0 ? "text-green-700" : "text-red-700"
                  )}
                >
                  {formatCurreny(item.amount)}
                </Text>
              </Pressable>
            )}
          />
        </View>
        <View className="p-3">
          <Button
            onPress={() => setTransactionFormVisibility(true)}
            variant="outline"
          >
            <Text>Add transaction</Text>
          </Button>
          <Button onPress={() => router.navigate("/test")} variant="outline">
            <Text>TEST SCREEN</Text>
          </Button>
        </View>
      </View>

      <AddWalletModal
        visible={isWalletFormVisible}
        onSubmit={submitWalletForm}
        onCancel={() => setWalletFormVisibility(false)}
      />
      <AddTransactionModal
        title={`Record transaction (${viewingWallet?.name} wallet)`}
        visible={isTransactionFormVisible}
        onSubmit={sumbmitTransaction}
        onCancel={() => setTransactionFormVisibility(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  containerEmpty: {
    flex: 1,
    justifyContent: "center",
    gap: 16,
    alignItems: "center",
  },

  wallet: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  walletCard: {
    width: "100%",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  walletMediumText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  walletSmallText: {
    fontSize: 16,
    opacity: 0.7,
  },

  content: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
    gap: 16,
  },

  recentTransactions: {
    borderRadius: 8,
    flex: 1,
  },
  recentTransactionsHeader: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listItem: {
    padding: 16,
  },
  listItemTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default IndexScreen;
