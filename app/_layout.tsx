import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { ThemeProvider } from "@/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { useSubscriptionStatus } from "@/features/auth/hooks/useSubscriptionStatus";
import "@/i18n/index";

const queryClient = new QueryClient();

function RootContent() {
  // Load subscription status at app level so it's always available
  useSubscriptionStatus();

  return <Slot />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const resolvedTheme = colorScheme === "dark" ? "dark" : "light";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider key={resolvedTheme} initialTheme={resolvedTheme}>
        <BottomSheetModalProvider>
          <QueryClientProvider client={queryClient}>
            <RootContent />
            <Toast topOffset={70} />
          </QueryClientProvider>
        </BottomSheetModalProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
