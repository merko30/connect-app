import { StripeProvider } from "@stripe/stripe-react-native";

const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PK || "";

console.log("Stripe key:", PUBLISHABLE_KEY);

export default function MyStripeProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <StripeProvider publishableKey={PUBLISHABLE_KEY}>{children}</StripeProvider>
  );
}
