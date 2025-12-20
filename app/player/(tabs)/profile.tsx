import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import useGetCurrentUser from "@/features/auth/hooks/useGetCurrentUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import { Href, Link } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Menu item constant
const PROFILE_MENU_ITEMS: {
  label: string;
  href: Href;
}[] = [
  {
    label: "Edit Profile",
    href: "/auth/profile-edit",
    // icon: <YourIconComponent />
  },
  {
    label: "Settings",
    href: "/",
  },
];

export default function ProfileScreen() {
  const { data: user } = useGetCurrentUser();

  const queryClient = useQueryClient();

  const handleLogout = () => {
    AsyncStorage.removeItem("token");
    queryClient.setQueryData(["current-user"], () => null);
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
        {PROFILE_MENU_ITEMS.map((item) => (
          <Link key={item.label} style={styles.menuItem} href={item.href}>
            {/* {item.icon && <View style={styles.icon}>{item.icon}</View>} */}
            <ThemedText style={styles.menuLabel}>{item.label}</ThemedText>
          </Link>
        ))}
        <ThemedButton
          title="Logout"
          variant="outline"
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
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  icon: {
    marginRight: 16,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
});
