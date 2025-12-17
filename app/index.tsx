import Splash from "@/components/Splash";
import useGetCurrentUser from "@/features/auth/hooks/useGetCurrentUser";
import { Redirect } from "expo-router";

const AppIndex = () => {
  const { data, isLoading } = useGetCurrentUser();

  // AsyncStorage.removeItem("token");

  if (isLoading) {
    return <Splash />;
  }

  if (!data) {
    return <Redirect href="/auth/login" />;
  }

  if (data?.role?.name === "Club") {
    return <Redirect href="/club/(tabs)" />;
  }

  return <Redirect href="/player/(tabs)" />;
};

export default AppIndex;
