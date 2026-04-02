import { IconSymbolName } from "@/components/ui/icon-symbol";
import { TranslationKey } from "@/i18n";
import { Href } from "expo-router";

export interface MenuItem {
  label: TranslationKey;
  icon: IconSymbolName;
  href: Href;
}

export const PLAYER_PROFILE_MENU_ITEMS: MenuItem[] = [
  {
    label: "profile.editUserInfo",
    icon: "person",
    href: "/player/(tabs)/profile/edit",
  },
  {
    label: "profile.editPlayerInfo",
    icon: "sportscourt",
    href: "/player/(tabs)/profile/player",
  },
];

export const CLUB_PROFILE_MENU_ITEMS: MenuItem[] = [
  {
    label: "profile.editUserInfo",
    icon: "person",
    href: "/club/profile/edit",
  },
  {
    label: "profile.editClubInfo",
    icon: "sportscourt",
    href: "/club/(tabs)/profile/club",
  },
  {
    label: "profile.myPosts",
    icon: "list.bullet",
    href: "/club/(tabs)/profile/posts",
  },
];

export const CLUB_SECURITY_SETTINGS_ITEMS: MenuItem[] = [
  {
    label: "profile.subscription",
    icon: "creditcard",
    href: "/club/profile/subscription",
  },
  {
    label: "profile.changePassword",
    icon: "key.fill",
    href: "/club/profile/change-password",
  },
  {
    label: "profile.security",
    icon: "lock.fill",
    href: "/club/(tabs)/profile/security",
  },
];

export const PLAYER_SECURITY_SETTINGS_ITEMS: MenuItem[] = [
  {
    label: "profile.subscription",
    icon: "creditcard",
    href: "/player/profile/subscription",
  },
  {
    label: "profile.changePassword",
    icon: "key.fill",
    href: "/player/profile/change-password",
  },
  {
    label: "profile.security",
    icon: "lock.fill",
    href: "/player/(tabs)/profile/security",
  },
];
