import "@/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { DatabaseProvider } from "@/contexts/database";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { migrateDbIfNeeded } from "@/services/database";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <DatabaseProvider databaseName="app.db" onInit={migrateDbIfNeeded}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="[walletID]" />
        </Stack>
        <StatusBar style="auto" />
      </DatabaseProvider>
      <PortalHost />
    </ThemeProvider>
  );
}

export default RootLayout;
