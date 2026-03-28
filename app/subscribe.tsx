import useGetCurrentUser from "@/features/auth/hooks/useGetCurrentUser";
import { usePaymentSubscription } from "@/features/auth/hooks/usePaymentSubscription";
import { TranslationKey } from "@/i18n";
import StripeProvider from "@/lib/stripe/Provider";
import { Role } from "@/types/users";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedButton } from "../components/ThemedButton";
import {
  CURRENT_SUBSCRIPTION_STATUS,
  SUBSCRIPTION_STATUS,
} from "../constants/subscription";
import { createStyle, useStyle } from "../theme";

const SubscribePageContent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: user } = useGetCurrentUser();
  const isClub = user?.role?.name === Role.ClubStaff.toString();

  const themed = useStyle(stylesheet);

  const { handleSubscribe, loading } = usePaymentSubscription({
    navigateOnSuccess: isClub ? "/club/(tabs)" : "/player/(tabs)",
  });

  const handleGoBack = () => {
    router.back();
  };

  // Check subscription status and redirect if needed
  useEffect(() => {
    if (
      CURRENT_SUBSCRIPTION_STATUS === SUBSCRIPTION_STATUS.ACTIVE ||
      CURRENT_SUBSCRIPTION_STATUS === SUBSCRIPTION_STATUS.TRIAL
    ) {
      // User has active subscription, redirect to appropriate dashboard
      // Uncomment to enable auto-redirect: router.replace(isClub ? "/club" : "/player");
    }
  }, [isClub, router]);

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
          {[
            isClub
              ? "subscription.club.benefit1"
              : "subscription.player.benefit1",
            isClub
              ? "subscription.club.benefit2"
              : "subscription.player.benefit2",
            isClub
              ? "subscription.club.benefit3"
              : "subscription.player.benefit3",
          ].map((benefit, index) => (
            <View key={index} style={themed.benefitItem}>
              <Text style={themed.benefitBullet}>•</Text>
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
                loading={loading}
              />
              <ThemedButton
                title={t("common.goBack")}
                onPress={handleGoBack}
                variant="outline"
                disabled={loading}
              />
            </>
          ) : (
            <>
              <ThemedButton
                title={t("subscription.subscribe")}
                onPress={handleSubscribe}
                variant="primary"
                loading={loading}
              />
              <ThemedButton
                title={t("subscription.maybeLater")}
                onPress={handleGoBack}
                variant="outline"
                disabled={loading}
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const SubscribePage = () => {
  return (
    <StripeProvider>
      <SubscribePageContent />
    </StripeProvider>
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
