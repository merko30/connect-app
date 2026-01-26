import Splash from "@/components/Splash";
import useGetCurrentUser from "@/features/auth/hooks/useGetCurrentUser";
import { Role } from "@/types/users";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect } from "react";

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

  if (data?.role?.name === Role.ClubStaff.toString()) {
    return <Redirect href="/club/(tabs)" />;
  }

  return <Redirect href="/player/(tabs)" />;
};

export default AppIndex;
