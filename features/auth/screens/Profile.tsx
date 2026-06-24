import { usersApi } from "@/api/auth";
import AvatarOrInitials from "@/components/AvatarOrInitials";
import RoleBasedButton from "@/components/RoleBasedButton";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  CLUB_PROFILE_MENU_ITEMS,
  CLUB_SECURITY_SETTINGS_ITEMS,
  COACH_PROFILE_MENU_ITEMS,
  PLAYER_PROFILE_MENU_ITEMS,
  PLAYER_SECURITY_SETTINGS_ITEMS,
} from "@/constants/profile";
import MenuSection from "@/features/auth/components/MenuSection";
import useGetCurrentUser from "@/features/auth/hooks/useGetCurrentUser";
import { createStyle, useStyle } from "@/theme";
import { Role } from "@/types/users";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import useUpdateAvatar from "../hooks/useUpdateAvatar";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { data: user } = useGetCurrentUser();
  const router = useRouter();
  const styles = useStyle(stylesheet);
  const queryClient = useQueryClient();

  const pathname = usePathname();
  const isClub = pathname.includes("club");
  const isCoach = user?.role?.name === Role.Coach.toString();
  const image = isClub
    ? user?.club?.logo
    : user?.player?.profilePhoto || user?.coach?.profilePhoto;

  const handleLogout = () => {
    AsyncStorage.removeItem("token");
    queryClient.setQueryData(["current-user"], () => null);
    router.navigate("/auth/login");
  };

  const { mutateAsync } = useUpdateAvatar();

  const pickImage = async () => {
    if (!user) return;
    // No permissions request is necessary for launching the image library.
    // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
    // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
    // so the app users aren't surprised by a system dialog after picking a video.
    // See "Invoke permissions for videos" sub section for more details.
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required.",
      );
      return;
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (result.canceled) return;

      const img = result.assets[0];

      const formData = new FormData();

      formData.append("files", {
        uri: img.uri,
        name: `${user?.id}-profile-photo-${Date.now()}.jpg`,
        type: img.mimeType || "image/jpeg",
      } as any);

      const response = await usersApi.custom<{ url: string; id: number }[]>(
        "/upload",
        {
          body: formData,
          method: "POST",
        },
      );

      await mutateAsync({ fileId: response[0].id, type: user.role.name });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: t("profile.avatarUpdateFailed"),
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.avatarSection}>
        {/* Show a circle for avatar */}
        <View style={styles.avatarCircle}>
          <AvatarOrInitials
            avatarUrl={image?.url}
            name={user?.firstName + " " + user?.lastName}
            size={96}
            style={styles.avatarCircle}
          />
          <Pressable style={styles.editAvatarBtn} onPress={pickImage}>
            <IconSymbol name="pencil" size={20} color="#ededed" />
          </Pressable>
        </View>
        <ThemedText variant="title" style={{ marginTop: 8 }}>
          {user?.club?.clubName}
        </ThemedText>
        <ThemedText variant="subtitle">
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
          items={
            isClub
              ? CLUB_PROFILE_MENU_ITEMS
              : isCoach
                ? COACH_PROFILE_MENU_ITEMS
                : PLAYER_PROFILE_MENU_ITEMS
          }
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

const stylesheet = createStyle((theme) => ({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: theme.colors.background,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarCircle: {
    position: "relative",
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.gray[500],
    borderRadius: theme.radii.full,
    padding: 6,
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
}));
