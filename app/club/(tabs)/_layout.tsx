import { Tabs } from "expo-router";
import React from "react";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/theme";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";

export default function TabLayout() {
  const { t } = useTheme();
  const { t: translate } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: t.colors.accent,
        tabBarStyle: {
          position: "absolute", // so we can float buttons
          height: 70,
          backgroundColor: t.colors.surface,
          borderTopLeftRadius: 20,
          borderTopWidth: 0,
          paddingTop: 10,
          borderTopRightRadius: 20,
          overflow: "visible", // important for floating button
          elevation: 10,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: translate("home.title"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: translate("search"),
          tabBarLabel: "",
          tabBarButton: (props) => (
            <Pressable
              onPress={props.onPress}
              style={{
                backgroundColor: t.colors.accent,
                top: -30,
                justifyContent: "center",
                alignItems: "center",
                width: 70,
                height: 70,
                left: "50%",
                transform: [{ translateX: "-50%" }],
                borderRadius: 35, // circle
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              <IconSymbol
                size={28}
                name="magnifyingglass"
                color={t.colors.background}
                style={{ zIndex: 10, elevation: 10 }}
              />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: translate("profile.title"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
