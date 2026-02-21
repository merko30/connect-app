import { ThemedText } from "@/components/ThemedText";
import EditClubInfo from "@/features/auth/screens/EditClubInfo";
import { createStyle, useStyle } from "@/theme";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

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
      {isOnboarding && (
        <View style={styles.titleContainer}>
          <ThemedText variant="title">
            {t("auth.completeClubProfile")}
          </ThemedText>
        </View>
      )}
      <EditClubInfo />
    </>
  );
};

export default OnboardingClub;

const stylesheet = createStyle((theme) => ({
  titleContainer: {
    paddingTop: 16,
    paddingHorizontal: 24,
    backgroundColor: theme.colors.background,
  },
}));
