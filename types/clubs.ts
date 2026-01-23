import { StrapiMedia, StrapiUser } from "./strapi";

export type ClubLevel = "amateur" | "semi-pro" | "pro";

export type ClubProfile = {
  id: number;
  documentId?: string;
  clubName: string;
  country: string;
  city?: string;
  league?: string;
  level: ClubLevel;

  logo?: {
    data: StrapiMedia | null;
  };

  website?: string;
  contactEmail?: string;
  contactPhone?: string;

  verified: boolean;

  user?: {
    data: StrapiUser;
  };

  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};
