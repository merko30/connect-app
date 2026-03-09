import { usersApi } from "@/api/auth";
import Header from "@/components/Header";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { TranslationKey } from "@/i18n";
import { createStyle, useStyle } from "@/theme";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useSubscriptionStatus } from "../hooks/useSubscriptionStatus";

type CancelResponse = {
  message?: string;
};

function SubscriptionSettings() {
  const { t } = useTranslation();
  const styles = useStyle(stylesheet);
  const queryClient = useQueryClient();
  const { data: subscription, isLoading, error } = useSubscriptionStatus();

  console.log(subscription, error);

  const isActiveSubscription =
    subscription?.isActive || subscription?.isTrialing;
  const status = subscription?.status || "inactive";
  const translatedStatusKey = `subscription.status.${status}` as TranslationKey;

  const { mutate: cancelSubscription, isPending: isCancelling } = useMutation({
    mutationFn: async () =>
      await usersApi.custom<CancelResponse>("/subscriptions/cancel", {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-status"] });
      Toast.show({
        type: "success",
        text1: t("subscription.settings.cancelSuccess"),
      });
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: t("subscription.settings.cancelError"),
      });
    },
  });

  const onCancelPress = () => {
    Alert.alert(
      t("subscription.settings.cancelTitle"),
      t("subscription.settings.cancelConfirm"),
      [
        {
          text: t("subscription.settings.keep"),
          style: "cancel",
        },
        {
          text: t("subscription.settings.cancelButton"),
          style: "destructive",
          onPress: () => cancelSubscription(),
        },
      ],
    );
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <SafeAreaView style={styles.container}>
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

        <ThemedButton
          title={t("subscription.settings.cancelButton")}
          onPress={onCancelPress}
          variant="outline"
          loading={isCancelling}
          disabled={!isActiveSubscription || isLoading}
        />
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
}));

export default SubscriptionSettings;
