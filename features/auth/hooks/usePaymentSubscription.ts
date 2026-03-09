import { useQueryClient } from "@tanstack/react-query";
import { Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import { useSubscription } from "./useSubscription";

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

  const handleSubscribe = async () => {
    try {
      const success = await stripeSubscribe(options.trialDays);

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
