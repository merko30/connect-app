import { ClubProfile } from "./clubs";
import { PlayerProfile } from "./players";

export interface User {
  email?: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  role: {
    name: string;
  };
  player?: PlayerProfile;
  club?: ClubProfile;
}

export enum Role {
  ClubStaff = "Club-staff",
  Player = "Player",
}

export interface LoginValues {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  jwt: string;
}

export const ROLE_IDS = {
  player: 3,
};
