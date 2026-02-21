import EditPlayerInfo from "@/features/auth/screens/EditPlayerInfo";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";

const OnboardingPlayer = () => {
  const params = useLocalSearchParams<{ from?: string }>();
  const source = Array.isArray(params.from) ? params.from[0] : params.from;
  const isOnboarding = source === "app";

  return (
    <>
      <Stack.Screen
        options={{ headerShown: false, gestureEnabled: !isOnboarding }}
      />
      <EditPlayerInfo />
    </>
  );
};

export default OnboardingPlayer;
