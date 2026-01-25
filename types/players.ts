import { StrapiMedia } from "./strapi";
import { User } from "./users";

export type PlayerPosition =
  | "GK"
  | "CB"
  | "LB"
  | "RB"
  | "CDM"
  | "CM"
  | "CAM"
  | "LW"
  | "RW"
  | "ST";

export type PreferredFoot = "left" | "right" | "both";

export type ExperienceLevel = "youth" | "amateur" | "semi-pro" | "pro";

export type PlayerVisibility = "public" | "clubs-only" | "private";

export type PlayerProfile = {
  documentId: string;
  id: number;
  firstName: string;
  lastName: string | null;
  dateOfBirth: string | null;
  nationality: string | null;
  location?: string | null;

  primaryPosition: PlayerPosition | null;
  secondaryPositions: PlayerPosition | null;
  preferredFoot?: PreferredFoot | null;

  heightCm: number | null;
  weightKg: number | null;

  currentClub: string | null;
  isFreeAgent: boolean;
  experienceLevel: ExperienceLevel | null;
  availabilityFrom?: string | null;

  profileImage?: {
    data: StrapiMedia | null;
  };

  highlights?: {
    data: StrapiMedia[];
  };

  visibility: PlayerVisibility;

  formerClubs?: { name: string }[] | null;

  user?: User;

  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};
