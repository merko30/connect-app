import { useQueryClient } from "@tanstack/react-query";
import { Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import { useSubscription } from "./useSubscription";
import { useSubscriptionStatus } from "./useSubscriptionStatus";

interface UsePaymentSubscriptionOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  trialDays?: number;
  navigateOnSuccess?: Href;
}

export const usePaymentSubscription = (
  options: UsePaymentSubscriptionOptions = {},
) => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { subscribe: stripeSubscribe, loading } = useSubscription();
  const { data: subscriptionStatus } = useSubscriptionStatus();

  const handleSubscribe = async () => {
    try {
      // Check if user has already used their trial
      // If they have, don't offer trial again (pass 0 instead of trialDays)
      const effectiveTrialDays = subscriptionStatus?.hasUsedTrial
        ? 0
        : options.trialDays;

      const success = await stripeSubscribe(effectiveTrialDays);

      if (success) {
        // Invalidate subscription cache to fetch fresh data
        queryClient.invalidateQueries({ queryKey: ["subscription-status"] });

        Toast.show({
          type: "success",
          text1: t("subscription.settings.subscriptionStarted"),
        });

        if (options.onSuccess) {
          options.onSuccess();
        }

        if (options.navigateOnSuccess) {
          router.replace(options.navigateOnSuccess);
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t("errorOccurred");

      if (options.onError) {
        options.onError(errorMessage);
      } else {
        Toast.show({
          type: "error",
          text1: errorMessage,
        });
      }
    }
  };

  return {
    handleSubscribe,
    loading,
  };
};
