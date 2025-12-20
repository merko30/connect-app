import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedButton } from "./ThemedButton";
import { ThemedText } from "./ThemedText";

export interface ProfileMenuItem {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
}

interface ProfileListProps {
  avatarUrl?: string;
  name: string;
  email?: string;
  menuItems: ProfileMenuItem[];
  onLogout: () => void;
}

export const ProfileList: React.FC<ProfileListProps> = ({
  avatarUrl,
  name,
  email,
  menuItems,
  onLogout,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.avatarSection}>
        <Image
          source={
            avatarUrl
              ? { uri: avatarUrl }
              : require("../assets/images/avatar-placeholder.png")
          }
          style={styles.avatar}
        />
        <ThemedText variant="title" style={{ marginTop: 8 }}>
          {name}
        </ThemedText>
        {email && (
          <ThemedText variant="caption" style={{ marginTop: 2 }}>
            {email}
          </ThemedText>
        )}
      </View>
      <View style={styles.menuSection}>
        {menuItems.map((item, idx) => (
          <TouchableOpacity
            key={item.label}
            style={styles.menuItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            {item.icon && <View style={styles.icon}>{item.icon}</View>}
            <ThemedText style={styles.menuLabel}>{item.label}</ThemedText>
          </TouchableOpacity>
        ))}
        <ThemedButton
          title="Logout"
          variant="outline"
          onPress={onLogout}
          style={{ marginTop: 24 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 48,
    backgroundColor: "#fff",
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatar: {
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
