import { StrapiMedia } from "./strapi";
import { User } from "./users";

export type CoachType =
  | "head-coach"
  | "assistant-coach"
  | "goalkeeping-coach"
  | "fitness-coach"
  | "analyst";

export type CoachLicenseLevel =
  | "none"
  | "uefa-c"
  | "uefa-b"
  | "uefa-a"
  | "uefa-pro";

export type CoachExperienceLevel = "youth" | "amateur" | "semi-pro" | "pro";
export type CoachVisibility = "public" | "clubs-only" | "private";

export type CoachProfile = {
  id: number;
  documentId?: string;
  firstName: string;
  lastName: string;
  coachType: CoachType;
  licenseLevel?: CoachLicenseLevel | null;
  experienceLevel?: CoachExperienceLevel | null;
  categories?: string[] | null;
  currentClub?: string | null;
  formerClubs?: { name: string }[] | null;
  yearsOfExperience?: number | null;
  bio?: string | null;
  profilePhoto?: {
    data: StrapiMedia | null;
  };
  dateOfBirth?: string | null;
  location?: string | null;
  nationality?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  isAvailable?: boolean | null;
  availableFrom?: string | null;
  visibility?: CoachVisibility | null;
  user?: User;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};
