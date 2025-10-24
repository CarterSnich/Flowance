import { Button } from "@/components/button";
import { Pressable } from "@/components/pressable";
import { Separator } from "@/components/separator";
import { Text } from "@/components/text";
import { AddTransactionModal } from "@/components/ui/add-transaction-modal";
import AddWalletModal from "@/components/ui/add-wallet-modal";
import { Colors } from "@/constants/theme";
import { useDatabaseContext } from "@/contexts/database";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Transaction } from "@/models/Transaction";
import { Wallet } from "@/models/Wallet";
import { formatCurreny, formatDate } from "@/utils/utils";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
  ViewToken,
} from "react-native";

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

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Flowance",
          headerRight: () => (
            <Pressable
              android_ripple={{ foreground: true, color: "grey" }}
              style={{ padding: 8, alignItems: "center" }}
              onPress={() => setWalletFormVisibility(true)}
            >
              <Text>Add wallet</Text>
            </Pressable>
          ),
        }}
      />

      {wallets.length > 0 ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={getWallets} />
          }
          nestedScrollEnabled
        >
          <View style={styles.container}>
            {/* Wallets */}
            <View>
              <FlatList
                data={wallets}
                keyExtractor={({ id }) => id.toString()}
                renderItem={({ item, index }) => (
                  <View style={[styles.wallet, { width: screen.width }]}>
                    <View
                      style={[styles.walletCard, { backgroundColor: bgColor }]}
                    >
                      <View>
                        <Text
                          style={[
                            styles.walletMediumText,
                            { color: textColorInverted },
                          ]}
                        >
                          Wallet {index + 1}
                        </Text>
                        <Text
                          style={[
                            styles.walletSmallText,
                            { color: textColorInverted },
                          ]}
                        >
                          {item.name}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={[
                            styles.walletMediumText,
                            { color: textColorInverted },
                          ]}
                        >
                          {formatCurreny(item.balance)}
                        </Text>
                        <Text
                          style={[
                            styles.walletSmallText,
                            { color: textColorInverted, textAlign: "right" },
                          ]}
                        >
                          Balance
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
                horizontal
                pagingEnabled
                onViewableItemsChanged={onWalletsSwipe}
              />
            </View>
            <View style={styles.content}>
              {/* Recent transactions */}
              <View
                style={[
                  styles.recentTransactions,
                  { backgroundColor: bgColor },
                ]}
              >
                <View style={styles.recentTransactionsHeader}>
                  <Text
                    type="defaultSemiBold"
                    style={{ color: textColorInverted }}
                  >
                    Recent transactions
                  </Text>
                  <Pressable
                    onPress={() => router.navigate(`/${viewingWallet?.id}`)}
                  >
                    <Text type="link">Show more</Text>
                  </Pressable>
                </View>
                <Separator color={textColorInverted} />
                <ScrollView nestedScrollEnabled>
                  {recentTransactions.map((t, index) => (
                    <Pressable
                      key={index}
                      style={styles.listItem}
                      onPress={() => router.navigate(`/${t.walletID}`)}
                    >
                      <View style={styles.listItemTitle}>
                        <Text
                          type="subtitle"
                          style={{ color: textColorInverted }}
                        >
                          {t.amount > 0 ? "Income" : "Expense"}
                        </Text>
                        <Text
                          type="subtitle"
                          style={{ color: textColorInverted }}
                        >
                          {formatCurreny(t.amount)}
                        </Text>
                      </View>
                      <Text style={[{ color: textColorInverted }]}>
                        {formatDate(t.date)}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
              <Button onPress={() => setTransactionFormVisibility(true)}>
                Add transaction
              </Button>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.containerEmpty}>
          <MaterialCommunityIcons
            name="wallet-bifold"
            size={128}
            color={textColor}
          />
          <Text style={{ fontSize: 24 }}>Add wallet to start</Text>
        </View>
      )}

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
    </>
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
