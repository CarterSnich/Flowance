import "@/global.css";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { DatabaseProvider } from "@/contexts/database";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { migrateDbIfNeeded } from "@/services/database";
import { PortalHost } from "@rn-primitives/portal";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, "background");
  const contentStyle = {
    backgroundColor: backgroundColor,
  };

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <DatabaseProvider databaseName="app.db" onInit={migrateDbIfNeeded}>
        <Stack screenOptions={{ contentStyle }} />
        <StatusBar style="auto" />
      </DatabaseProvider>
      <PortalHost />
    </ThemeProvider>
  );
}

export default RootLayout;
