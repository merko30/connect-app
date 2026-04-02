import { ThemedText } from "@/components/ThemedText";
import EditClubInfo from "@/features/auth/screens/EditClubInfo";
import { createStyle, useStyle } from "@/theme";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OnboardingClub = () => {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ from?: string }>();
  const source = Array.isArray(params.from) ? params.from[0] : params.from;
  const isOnboarding = source === "app";
  const styles = useStyle(stylesheet);

  return (
    <>
      <Stack.Screen
        options={{ headerShown: false, gestureEnabled: !isOnboarding }}
      />
      <SafeAreaView style={styles.container}>
        {isOnboarding && (
          <View style={styles.titleContainer}>
            <ThemedText style={styles.title}>
              {t("auth.completeClubProfile")}
            </ThemedText>
          </View>
        )}
        <EditClubInfo />
      </SafeAreaView>
    </>
  );
};

export default OnboardingClub;

const stylesheet = createStyle((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    paddingBottom: 12,
    color: theme.colors.text,
  },
  titleContainer: {
    paddingTop: 16,
    paddingHorizontal: 24,
    backgroundColor: theme.colors.background,
  },
}));
