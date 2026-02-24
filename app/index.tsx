import Splash from "@/components/Splash";
import useGetCurrentUser from "@/features/auth/hooks/useGetCurrentUser";
import { ClubProfile } from "@/types/clubs";
import { PlayerProfile } from "@/types/players";
import { Role } from "@/types/users";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect } from "react";

const isPlayerProfileComplete = (player?: PlayerProfile | null) => {
  if (!player) {
    return false;
  }

  return (
    !!player.dateOfBirth &&
    player.heightCm != null &&
    player.weightKg != null &&
    !!player.preferredFoot &&
    !!player.primaryPosition &&
    !!player.experienceLevel
  );
};

const isClubProfileComplete = (club?: ClubProfile | null) => {
  if (!club) {
    return false;
  }

  return !!club.clubName?.trim() && !!club.country?.trim() && !!club.level;
};

const AppIndex = () => {
  const { data, isLoading, error } = useGetCurrentUser();

  useEffect(() => {
    if (error) {
      AsyncStorage.removeItem("token");
    }
  }, [error]);

  if (isLoading) {
    return <Splash />;
  }

  if (!data) {
    return <Redirect href="/auth/login" />;
  }

  console.log(data.subscriptionStatus);

  if (
    data &&
    data.subscriptionStatus !== "active" &&
    data.subscriptionStatus !== "trialing"
  ) {
    return <Redirect href="/subscribe" />;
  }

  if (
    data?.role?.name === Role.ClubStaff.toString() &&
    data?.club &&
    data.club.verified === false
  ) {
    return <Redirect href="/club/not-verified" />;
  }

  if (
    data?.role?.name === Role.ClubStaff.toString() &&
    !isClubProfileComplete(data?.club)
  ) {
    return <Redirect href="/onboarding/club?from=app" />;
  }

  if (
    data?.role?.name === Role.Player.toString() &&
    !isPlayerProfileComplete(data?.player)
  ) {
    return <Redirect href="/onboarding/player?from=app" />;
  }

  if (data?.role?.name === Role.ClubStaff.toString()) {
    return <Redirect href="/club/(tabs)" />;
  }

  return <Redirect href="/player/(tabs)" />;
};

export default AppIndex;
