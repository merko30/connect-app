import Header from "@/components/Header";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { TranslationKey } from "@/i18n";
import { createStyle, useStyle } from "@/theme";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSubscriptionStatus } from "../hooks/useSubscriptionStatus";

function SubscriptionSettings() {
  const router = useRouter();
  const { t } = useTranslation();
  const styles = useStyle(stylesheet);
  const { data: subscription, isLoading } = useSubscriptionStatus();
  const portalUrl =
    Constants.expoConfig?.extra?.subscriptionPortalUrl ||
    process.env.EXPO_PUBLIC_SUBSCRIPTION_PORTAL_URL;

  const isActiveSubscription =
    subscription?.isActive || subscription?.isTrialing;
  const status = subscription?.status || "inactive";
  const translatedStatusKey = `subscription.status.${status}` as TranslationKey;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <Header title={t("subscription.settings.title")} />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <ThemedText style={styles.label}>
            {t("subscription.settings.currentStatus")}
          </ThemedText>
          <ThemedText style={styles.status}>
            {isLoading
              ? t("loading")
              : t(translatedStatusKey, {
                  defaultValue: t("subscription.status.inactive"),
                })}
          </ThemedText>
          <ThemedText style={styles.description}>
            {isLoading
              ? "-"
              : isActiveSubscription
                ? t("subscription.settings.activeDescription")
                : t("subscription.settings.inactiveDescription")}
          </ThemedText>
        </View>

        {subscription && subscription.hasSubscription && (
          <View style={styles.detailsCard}>
            <ThemedText style={styles.detailsTitle}>
              {t("subscription.settings.details")}
            </ThemedText>

            {subscription.daysRemaining > 0 && (
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>
                  {t("subscription.settings.daysRemaining")}
                </ThemedText>
                <ThemedText style={styles.detailValue}>
                  {subscription.daysRemaining}
                </ThemedText>
              </View>
            )}

            {subscription.currentPeriodEnd && (
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>
                  {t("subscription.settings.periodEnd")}
                </ThemedText>
                <ThemedText style={styles.detailValue}>
                  {formatDate(subscription.currentPeriodEnd)}
                </ThemedText>
              </View>
            )}

            {subscription.cancelAtPeriodEnd && subscription.willCancelAt && (
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>
                  {t("subscription.settings.willCancelAt")}
                </ThemedText>
                <ThemedText style={styles.detailValue}>
                  {formatDate(subscription.willCancelAt)}
                </ThemedText>
              </View>
            )}
          </View>
        )}

        <View style={styles.manageInfoCard}>
          <ThemedText style={styles.manageInfoText}>
            {t("subscription.settings.manageInfo")}
          </ThemedText>
        </View>

        {portalUrl && (
          <ThemedButton
            title={t("subscription.settings.manageSubscription")}
            onPress={() =>
              router.push({
                pathname: "/auth/subscription-portal",
                params: { url: portalUrl },
              })
            }
            variant="primary"
            style={{ marginBottom: 12 }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const stylesheet = createStyle((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.spacer,
    marginBottom: 24,
  },
  detailsCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.spacer,
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    color: theme.colors.text,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.spacer,
  },
  detailLabel: {
    fontSize: 13,
    color: theme.colors.gray[400],
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "500",
    color: theme.colors.text,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: theme.colors.gray[300],
  },
  status: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.gray[400],
  },
  manageInfoCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.spacer,
    marginBottom: 16,
  },
  manageInfoText: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.gray[400],
  },
}));

export default SubscriptionSettings;
