import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { createStyle, useStyle, useTheme } from "@/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ClubNotVerified = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const styles = useStyle(stylesheet);
  const { t: theme } = useTheme();

  const onLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/auth/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <IconSymbol
            name="exclamationmark.triangle.fill"
            size={48}
            color={theme.colors.secondary}
          />
        </View>
        <ThemedText variant="title" style={styles.title}>
          {t("auth.clubNotVerifiedTitle")}
        </ThemedText>
        <ThemedText style={styles.body}>
          {t("auth.clubNotVerifiedBody")}
        </ThemedText>
        <ThemedButton
          title={t("profile.logout")}
          onPress={onLogout}
          variant="secondary"
          style={styles.logoutButton}
        />
      </View>
    </SafeAreaView>
  );
};

export default ClubNotVerified;

const stylesheet = createStyle((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 12,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
  },
  title: {
    textAlign: "center",
    marginBottom: 4,
  },
  body: {
    textAlign: "center",
    color: theme.colors.gray[500],
    opacity: 0.8,
  },
  logoutButton: {
    marginTop: 12,
    alignSelf: "stretch",
  },
}));
