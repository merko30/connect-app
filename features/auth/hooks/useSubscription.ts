import { usersApi } from "@/api/auth";
import { useStripe } from "@stripe/stripe-react-native";
import { useState } from "react";

interface UseSubscriptionReturn {
  loading: boolean;
  subscribe: (trialDays?: number) => Promise<boolean>;
  error: string | null;
}

export const useSubscription = (): UseSubscriptionReturn => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = async (trialDays?: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Ask backend to create subscription
      const res = await usersApi.custom<{
        clientSecret: string;
      }>(`/subscriptions/subscribe`, {
        method: "POST",
        body: {
          trialPeriodDays: trialDays,
        },
      });

      const { clientSecret } = await res;

      // 2️⃣ Initialize payment sheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "X Connect",
        ...(trialDays
          ? { setupIntentClientSecret: clientSecret }
          : { paymentIntentClientSecret: clientSecret }),
        allowsDelayedPaymentMethods: true,
      });

      if (initError) {
        setError(initError.message || "Failed to initialize payment");
        console.error("Init error:", initError);
        return false;
      }

      // 3️⃣ Present payment sheet (opens payment UI)
      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        if (paymentError.code !== "Canceled") {
          setError(paymentError.message || "Payment failed");
          console.error("Payment error:", paymentError);
        }
        return false;
      }

      console.log("Subscription successful!");
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Subscription failed";
      setError(errorMessage);
      console.error("Subscription error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    subscribe,
    error,
  };
};
