import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { themes } from "@/theme";
import { ThemeProvider } from "@pavelgric/react-native-theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import "@/i18n/index";

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            themes={themes}
            initialTheme={colorScheme as "light" | "dark"}
          >
            <Slot />
            <Toast topOffset={70} />
          </ThemeProvider>
        </QueryClientProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
