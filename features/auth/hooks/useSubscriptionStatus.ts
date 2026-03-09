import { usersApi } from "@/api/auth";
import { SubscriptionStatus } from "@/types/subscriptions";
import { useQuery } from "@tanstack/react-query";

export const useSubscriptionStatus = () => {
  return useQuery({
    queryKey: ["subscription-status"],
    queryFn: () => usersApi.custom<SubscriptionStatus>("/subscriptions/status"),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};
