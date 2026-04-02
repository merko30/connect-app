import useGetCurrentUser from "@/features/auth/hooks/useGetCurrentUser";
import { TranslationKey } from "@/i18n";
import { Role } from "@/types/users";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Linking, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedButton } from "../components/ThemedButton";
import { createStyle, useStyle } from "../theme";

const portalUrl =
  process.env.EXPO_PUBLIC_SUBSCRIPTION_PORTAL_URL || "http://localhost:5173";

const SubscribePage = () => {
  const { t } = useTranslation();
  const { data: user } = useGetCurrentUser();
  const isClub = user?.role?.name === Role.ClubStaff.toString();
  const themed = useStyle(stylesheet);
  const router = useRouter();
  const qClient = useQueryClient();

  useEffect(() => {
    const handleUrl = async ({ url }: { url: string }) => {
      console.log(url);

      if (url?.includes("refresh=true")) {
        qClient.invalidateQueries({ queryKey: ["current-user"] }).then(() => {
          router.replace("/");
        });
      }
    };

    const sub = Linking.addEventListener("url", handleUrl);

    // handle cold start (VERY important)
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl({ url });
    });

    return () => sub.remove();
  }, []);

  const benefits: TranslationKey[] = isClub
    ? [
        "subscription.club.benefit1",
        "subscription.club.benefit2",
        "subscription.club.benefit3",
      ]
    : [
        "subscription.player.benefit1",
        "subscription.player.benefit2",
        "subscription.player.benefit3",
      ];

  const handleOpenSubscriptionPortal = async () => {
    const canOpen = await Linking.canOpenURL(portalUrl);
    if (canOpen) {
      await Linking.openURL(portalUrl);
    }
  };

  return (
    <SafeAreaView style={themed.container}>
      <ScrollView
        style={themed.container}
        contentContainerStyle={themed.scrollContent}
      >
        <View style={themed.header}>
          <Text style={themed.title}>
            {t(
              isClub ? "subscription.club.title" : "subscription.player.title",
            )}
          </Text>
          <Text style={themed.subtitle}>
            {t(
              isClub
                ? "subscription.club.subtitle"
                : "subscription.player.subtitle",
            )}
          </Text>
        </View>

        <View style={themed.descriptionSection}>
          <Text style={themed.descriptionText}>
            {t(
              isClub
                ? "subscription.club.description"
                : "subscription.player.description",
            )}
          </Text>
        </View>

        <View style={themed.benefitsSection}>
          {benefits.map((benefit, index) => (
            <View key={index} style={themed.benefitItem}>
              <Text style={themed.benefitBullet}>•</Text>
              <Text style={themed.benefitText}>{t(benefit)}</Text>
            </View>
          ))}
        </View>

        <View style={themed.buttonContainer}>
          <ThemedButton
            title={t("subscription.subscribe")}
            onPress={handleOpenSubscriptionPortal}
            variant="primary"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubscribePage;

const stylesheet = createStyle((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    marginTop: 50,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.accent,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.gray[400],
    lineHeight: 24,
  },
  descriptionSection: {
    marginVertical: 20,
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
  },
  benefitsSection: {
    marginVertical: 20,
  },
  benefitItem: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  benefitBullet: {
    fontSize: 18,
    color: theme.colors.primary,
    marginRight: 12,
    fontWeight: "600",
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
    gap: 12,
  },
}));
