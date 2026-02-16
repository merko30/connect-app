export const PLAYER_SUBSCRIPTION_BENEFITS = [
  "subscription.player.benefit1",
  "subscription.player.benefit2",
  "subscription.player.benefit3",
  "subscription.player.benefit4",
  "subscription.player.benefit5",
];

export const CLUB_SUBSCRIPTION_BENEFITS = [
  "subscription.club.benefit1",
  "subscription.club.benefit2",
  "subscription.club.benefit3",
  "subscription.club.benefit4",
  "subscription.club.benefit5",
];

export const SUBSCRIPTION_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  EXPIRED: "past_due",
  TRIAL: "trialing",
} as const;

export type SubscriptionStatus =
  (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];

// Hardcoded status - UPDATE THIS LATER
export const CURRENT_SUBSCRIPTION_STATUS: SubscriptionStatus =
  SUBSCRIPTION_STATUS.INACTIVE;
