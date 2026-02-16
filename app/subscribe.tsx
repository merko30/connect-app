import useGetCurrentUser from "@/features/auth/hooks/useGetCurrentUser";
import { TranslationKey } from "@/i18n";
import { Role } from "@/types/users";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedButton } from "../components/ThemedButton";
import {
  CLUB_SUBSCRIPTION_BENEFITS,
  CURRENT_SUBSCRIPTION_STATUS,
  PLAYER_SUBSCRIPTION_BENEFITS,
  SUBSCRIPTION_STATUS,
} from "../constants/subscription";
import { createStyle, useStyle } from "../theme";

const SubscribePage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: user } = useGetCurrentUser();
  const isClub = user?.role?.name === Role.ClubStaff.toString();
  const benefits = isClub
    ? CLUB_SUBSCRIPTION_BENEFITS
    : PLAYER_SUBSCRIPTION_BENEFITS;

  const themed = useStyle(stylesheet);

  // Check subscription status and redirect if needed
  useEffect(() => {
    if (
      CURRENT_SUBSCRIPTION_STATUS === SUBSCRIPTION_STATUS.ACTIVE ||
      CURRENT_SUBSCRIPTION_STATUS === SUBSCRIPTION_STATUS.TRIAL
    ) {
      // User has active subscription, redirect to appropriate dashboard
      const redirectPath = isClub ? "/club" : "/player";
      // Uncomment to enable auto-redirect
      // router.replace(redirectPath);
    }
  }, [isClub, router]);

  const handleSubscribe = () => {
    // TODO: Implement subscription logic
    console.log("Subscribe clicked");
    // For now, just show an alert or navigate
  };

  const handleGoBack = () => {
    router.back();
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

        <View style={themed.pricingCard}>
          <View style={themed.priceRow}>
            <Text style={themed.currency}>€</Text>
            <Text style={themed.price}>5</Text>
            <Text style={themed.period}>/ {t("subscription.perMonth")}</Text>
          </View>
          <Text style={themed.priceDescription}>
            {t("subscription.billedMonthly")}
          </Text>
        </View>

        <View style={themed.benefitsSection}>
          <Text style={themed.benefitsTitle}>{t("subscription.benefits")}</Text>
          {benefits.map((benefit, index) => (
            <View key={index} style={themed.benefitItem}>
              <View style={themed.checkmark}>
                <Text style={themed.checkmarkText}>✓</Text>
              </View>
              <Text style={themed.benefitText}>
                {t(benefit as TranslationKey)}
              </Text>
            </View>
          ))}
        </View>

        <View style={themed.buttonContainer}>
          {CURRENT_SUBSCRIPTION_STATUS === SUBSCRIPTION_STATUS.ACTIVE ? (
            <>
              <ThemedButton
                title={t("subscription.manageSubscription")}
                onPress={handleSubscribe}
                variant="primary"
              />
              <ThemedButton
                title={t("common.goBack")}
                onPress={handleGoBack}
                variant="outline"
              />
            </>
          ) : (
            <>
              <ThemedButton
                title={t("subscription.subscribe")}
                onPress={handleSubscribe}
                variant="primary"
              />
              <ThemedButton
                title={t("subscription.maybeLater")}
                onPress={handleGoBack}
                variant="outline"
              />
            </>
          )}
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
  benefitsSection: {
    marginVertical: 30,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.accent,
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkmarkText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  benefitText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
  },
  pricingCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 10,
  },
  currency: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  price: {
    fontSize: 36,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  period: {
    fontSize: 16,
    color: theme.colors.gray[400],
    marginLeft: 4,
  },
  priceDescription: {
    fontSize: 14,
    color: theme.colors.gray[400],
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
}));
