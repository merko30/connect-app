import { IconSymbolName } from "@/components/ui/icon-symbol";
import { Href } from "expo-router";

export interface MenuItem {
  label: string;
  icon: IconSymbolName;
  href: Href;
}

export const PLAYER_PROFILE_MENU_ITEMS: MenuItem[] = [
  {
    label: "Edit user information",
    icon: "person",
    href: "/auth/profile/edit",
  },
  {
    label: "Edit player information",
    icon: "sportscourt",
    href: "/auth/profile/player",
  },
];

export const CLUB_PROFILE_MENU_ITEMS: MenuItem[] = [
  {
    label: "Edit user information",
    icon: "person",
    href: "/auth/profile/edit",
  },
  {
    label: "Edit club information",
    icon: "sportscourt",
    href: "/auth/profile/club",
  },
];
