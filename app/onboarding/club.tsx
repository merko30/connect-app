import EditClubInfo from "@/features/auth/screens/EditClubInfo";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";

const OnboardingClub = () => {
  const params = useLocalSearchParams<{ from?: string }>();
  const source = Array.isArray(params.from) ? params.from[0] : params.from;
  const isOnboarding = source === "app";

  return (
    <>
      <Stack.Screen
        options={{ headerShown: false, gestureEnabled: !isOnboarding }}
      />
      <EditClubInfo />
    </>
  );
};

export default OnboardingClub;
