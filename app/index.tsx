import Splash from "@/components/Splash";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

const AppIndex = () => {
  const [loggedIn] = useState(false);
  const [isClub, setIsClub] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsClub(false);
      setLoading(false);
    }, 3000);
  }, []);

  if (loading) {
    return <Splash />;
  }

  if (!loggedIn) {
    return <Redirect href="/auth/login" />;
  }

  if (isClub) {
    return <Redirect href="/club/(tabs)" />;
  }

  return <Redirect href="/player/(tabs)" />;
};

export default AppIndex;
