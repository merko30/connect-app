import { ClubProfile } from "./clubs";
import { CoachProfile } from "./coaches";
import { PlayerProfile } from "./players";

import { StrapiMediaType } from "./strapi";

export interface User {
  id?: string;
  documentId?: string;
  email?: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  role: {
    name: string;
  };
  location: string | null;
  nationality: string | null;
  citizenship: string | null;
  player?: PlayerProfile;
  coach?: CoachProfile;
  club?: ClubProfile;
  subscriptionStatus?: string; // e.g., "active", "inactive", "trial"
  profilePhoto: StrapiMediaType | string | number;
}

export const Role = {
  ClubStaff: "Club-staff",
  Player: "Player",
  Coach: "Coach",
};

export interface LoginValues {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  jwt: string;
}

export const ROLE_IDS = {
  PLAYER: 3,
  CLUB_STAFF: 4,
  COACH: 5,
};
