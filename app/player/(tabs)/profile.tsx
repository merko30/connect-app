import { ThemedText } from "@/components/ThemedText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function TabTwoScreen() {
  const router = useRouter();
  const logout = () => {
    AsyncStorage.removeItem("token");
    router.navigate("/auth/login");
  };
  return (
    <SafeAreaView>
      <Pressable onPress={logout}>
        <ThemedText>Logout</ThemedText>
      </Pressable>
    </SafeAreaView>
  );
}
