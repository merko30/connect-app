import Splash from "@/components/Splash";
import useGetCurrentUser from "@/features/auth/hooks/useGetCurrentUser";
import { Role } from "@/types/users";
import { Redirect } from "expo-router";

const AppIndex = () => {
  const { data, isLoading } = useGetCurrentUser();

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
