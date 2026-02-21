import { ThemedText } from "@/components/ThemedText";
import EditPlayerInfo from "@/features/auth/screens/EditPlayerInfo";
import { createStyle, useStyle } from "@/theme";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OnboardingPlayer = () => {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ from?: string }>();
  const source = Array.isArray(params.from) ? params.from[0] : params.from;
  const isOnboarding = source === "app";
  const styles = useStyle(stylesheet);

  return (
    <SafeAreaView style={styles.container}>
      {isOnboarding && (
        <View style={styles.titleContainer}>
          <ThemedText style={styles.title}>
            {t("auth.completePlayerProfile")}
          </ThemedText>
        </View>
      )}
      <EditPlayerInfo />
    </SafeAreaView>
  );
};

export default OnboardingPlayer;

const stylesheet = createStyle((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  titleContainer: {
    paddingTop: 16,
    paddingLeft: 24,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
  },
}));
