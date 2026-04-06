import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import "@/i18n/index";
import { AppearanceProvider } from "@/theme/appearance";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppearanceProvider>
        <BottomSheetModalProvider>
          <QueryClientProvider client={queryClient}>
            <Slot />
            <Toast topOffset={70} />
          </QueryClientProvider>
        </BottomSheetModalProvider>
      </AppearanceProvider>
    </GestureHandlerRootView>
  );
}
