export interface SubscriptionStatus {
  hasSubscription: boolean;
  isActive: boolean;
  isTrialing: boolean;
  isCanceled: boolean;
  isPastDue: boolean;
  status: string;
  subscriptionId: string | null;
  customerId: string | null;
  priceId: string | null;
  currentPeriodEnd: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  daysRemaining: number;
  cancelAtPeriodEnd: boolean;
  cancelAt: string | null;
  hasUsedTrial: boolean;
  willCancelAt: string | null;
}
