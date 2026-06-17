import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import "react-native-reanimated";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import "@/i18n/index";
import { AppearanceProvider } from "@/theme/appearance";
import { useEffect } from "react";
import { Platform } from "react-native";

const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

    if (Platform.OS === "ios") {
      Purchases.configure({
        apiKey: process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY || "",
      });
    } else if (Platform.OS === "android") {
      Purchases.configure({ apiKey: "<revenuecat_project_google_api_key>" });

      // OR: if building for Amazon, be sure to follow the installation instructions then:
      Purchases.configure({
        apiKey: "<revenuecat_project_amazon_api_key>",
        useAmazon: true,
      });

      // OR: if building for Galaxy Store, install react-native-purchases-store-galaxy, then:
      // Purchases.configure({
      //   apiKey: '<revenuecat_project_galaxy_api_key>',
      //   store: 'GALAXY',
      //   galaxyBillingMode: GALAXY_BILLING_MODE.TEST,
      // });
    }
  }, []);

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
