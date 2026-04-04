import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { ThemeProvider } from "@/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import "@/i18n/index";

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const resolvedTheme = colorScheme === "dark" ? "dark" : "light";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider key={resolvedTheme} initialTheme={resolvedTheme}>
        <BottomSheetModalProvider>
          <QueryClientProvider client={queryClient}>
            <Slot />
            <Toast topOffset={70} />
          </QueryClientProvider>
        </BottomSheetModalProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
