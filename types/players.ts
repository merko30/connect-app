import { StrapiMedia, StrapiUser } from "./strapi";

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
  lastName: string;
  dateOfBirth: string | null;
  nationality?: string;
  location?: string;

  primaryPosition: PlayerPosition;
  secondaryPositions?: PlayerPosition;
  preferredFoot?: PreferredFoot;

  heightCm?: number;
  weightKg?: number;

  currentClub?: string;
  isFreeAgent: boolean;
  experienceLevel?: ExperienceLevel;
  availabilityFrom?: string;

  profileImage?: {
    data: StrapiMedia | null;
  };

  highlights?: {
    data: StrapiMedia[];
  };

  visibility: PlayerVisibility;

  user?: {
    data: StrapiUser;
  };

  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};
