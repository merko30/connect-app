import RoleBasedButton from "@/components/RoleBasedButton";
import { ThemedText } from "@/components/ThemedText";
import {
  CLUB_PROFILE_MENU_ITEMS,
  CLUB_SECURITY_SETTINGS_ITEMS,
  PLAYER_PROFILE_MENU_ITEMS,
  PLAYER_SECURITY_SETTINGS_ITEMS,
} from "@/constants/profile";
import MenuSection from "@/features/auth/components/MenuSection";
import useGetCurrentUser from "@/features/auth/hooks/useGetCurrentUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { data: user } = useGetCurrentUser();
  const router = useRouter();

  const pathname = usePathname();
  const isClub = pathname.includes("club");

  const queryClient = useQueryClient();

  const handleLogout = () => {
    AsyncStorage.removeItem("token");
    queryClient.setQueryData(["current-user"], () => null);
    router.navigate("/auth/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.avatarSection}>
        {/* Show a circle for avatar */}
        <View style={styles.avatarCircle} />
        <ThemedText variant="title" style={{ marginTop: 8 }}>
          {user?.firstName + " " + user?.lastName}
        </ThemedText>
        {user?.email && (
          <ThemedText variant="caption" style={{ marginTop: 2 }}>
            {user.email}
          </ThemedText>
        )}
      </View>
      <View style={styles.menuSection}>
        <MenuSection
          title={t("profile.title")}
          items={isClub ? CLUB_PROFILE_MENU_ITEMS : PLAYER_PROFILE_MENU_ITEMS}
        />
        <MenuSection
          title={t("profile.settings")}
          items={
            isClub
              ? CLUB_SECURITY_SETTINGS_ITEMS
              : PLAYER_SECURITY_SETTINGS_ITEMS
          }
        />
        <RoleBasedButton
          title={t("profile.logout")}
          onPress={handleLogout}
          style={{ marginTop: 24 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#eee",
  },
  menuSection: {
    width: "100%",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 12,
    color: "#666",
    textTransform: "uppercase",
  },
  menuItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    gap: 12,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
});
