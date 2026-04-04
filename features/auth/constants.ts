// Slovenian phone number regex
import {
  phoneSchema,
  REGISTER_ERRORS,
  SLOVENIAN_PHONE_REGEX,
} from "@/constants/validation";
import { ClubProfile } from "@/types/clubs";
import { PlayerProfile } from "@/types/players";
import { User } from "@/types/users";
import * as z from "zod";

export const PRIMARY_POSITIONS = [
  "GK",
  "CB",
  "LB",
  "RB",
  "CDM",
  "CM",
  "CAM",
  "LM",
  "RM",
  "LW",
  "RW",
  "CF",
  "ST",
];

export const SECONDARY_POSITIONS = [
  "GK",
  "CB",
  "LB",
  "RB",
  "CDM",
  "CM",
  "CAM",
  "LM",
  "RM",
  "LW",
  "RW",
  "CF",
  "ST",
];

export const playerRegisterSchema = z.object({
  dateOfBirth: z.instanceof(Date).nullable(),
  heightCm: z
    .string()
    .regex(/^\d+$/, "Height must be a number")
    .superRefine((val, ctx) => {
      const height = Number(val);
      if (height < 140 || height > 220) {
        ctx.addIssue({
          code: "custom",
          message: "Height must be between 140 and 220 cm",
        });
      }
    }),
  weightKg: z
    .string()
    .regex(/^\d+$/, "Weight must be a number")
    .superRefine((val, ctx) => {
      const weight = Number(val);
      if (weight < 40 || weight > 150) {
        ctx.addIssue({
          code: "custom",
          message: "Weight must be between 40 and 150 kg",
        });
      }
    }),
  preferredFoot: z.enum(["left", "right", "both"]),
  primaryPosition: z.string().min(1, "Primary position is required"),
  secondaryPositions: z.string().optional(),
  experienceLevel: z.string().min(1, "Experience level is required"),
  currentClub: z.string().optional(),
  formerClubs: z.array(z.object({ name: z.string().min(1) })).optional(),
  isFreeAgent: z.boolean().optional(),
  availabilityFrom: z.instanceof(Date).nullable(),
});

export type PlayerRegisterForm = z.infer<typeof playerRegisterSchema>;

export const getPlayerRegisterDefaults = (
  player?: PlayerProfile | null,
): PlayerRegisterForm => ({
  dateOfBirth: player?.dateOfBirth ? new Date(player.dateOfBirth) : null,

  heightCm: player?.heightCm != null ? String(player.heightCm) : "",

  weightKg: player?.weightKg != null ? String(player.weightKg) : "",

  preferredFoot: player?.preferredFoot ?? "right",

  primaryPosition: player?.primaryPosition ?? "",

  secondaryPositions: player?.secondaryPositions ?? undefined,

  experienceLevel: player?.experienceLevel ?? "",

  currentClub: player?.currentClub ?? "",

  formerClubs: player?.formerClubs?.map((club) => ({ name: club.name })) ?? [],

  isFreeAgent: player?.isFreeAgent ?? false,

  availabilityFrom: player?.availabilityFrom
    ? new Date(player.availabilityFrom)
    : null,
});

export const coachRegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  coachType: z.string().min(1, "Coach type is required"),
  licenseLevel: z.string().optional(),
  experienceLevel: z.string().optional(),
  categories: z.string().optional(),
  currentClub: z.string().optional(),
  formerClubs: z.array(z.object({ name: z.string().min(1) })).optional(),
  yearsOfExperience: z
    .string()
    .regex(/^\d*$/, "Years of experience must be a number")
    .optional(),
  bio: z.string().optional(),
  dateOfBirth: z.instanceof(Date).nullable(),
  location: z.string().optional(),
  nationality: z.string().optional(),
  contactEmail: z
    .email({ message: "register.error.contactEmail" })
    .optional()
    .or(z.literal("")),
  contactPhone: phoneSchema,
  isAvailable: z.boolean().optional(),
  availableFrom: z.instanceof(Date).nullable(),
  visibility: z.enum(["public", "clubs-only", "private"]),
});

export type CoachRegisterForm = z.infer<typeof coachRegisterSchema>;

export const getCoachRegisterDefaults = (
  coach?: any,
  user?: User | null,
): CoachRegisterForm => ({
  firstName: coach?.firstName ?? user?.firstName ?? "",
  lastName: coach?.lastName ?? user?.lastName ?? "",
  coachType: coach?.coachType ?? "",
  licenseLevel: coach?.licenseLevel ?? "none",
  experienceLevel: coach?.experienceLevel ?? "",
  categories: Array.isArray(coach?.categories)
    ? coach.categories.join(", ")
    : "",
  currentClub: coach?.currentClub ?? "",
  formerClubs:
    coach?.formerClubs?.map((club: { name: string }) => ({
      name: club.name,
    })) ?? [],
  yearsOfExperience:
    coach?.yearsOfExperience != null ? String(coach.yearsOfExperience) : "",
  bio: coach?.bio ?? "",
  dateOfBirth: coach?.dateOfBirth ? new Date(coach.dateOfBirth) : null,
  location: coach?.location ?? user?.location ?? "",
  nationality: coach?.nationality ?? user?.nationality ?? "",
  contactEmail: coach?.contactEmail ?? user?.email ?? "",
  contactPhone: coach?.contactPhone ?? user?.phoneNumber ?? "",
  isAvailable: coach?.isAvailable ?? true,
  availableFrom: coach?.availableFrom ? new Date(coach.availableFrom) : null,
  visibility: coach?.visibility ?? "clubs-only",
});

export const clubSchema = z.object({
  clubName: z.string().min(1, { message: "register.error.clubName" }),
  country: z.string().min(1, { message: "register.error.country" }),
  city: z.string().optional(),
  league: z.string().optional(),
  level: z.enum(["amateur", "semi-pro", "pro"], {
    message: "register.error.level",
  }),
  website: z
    .string()
    .url({ message: "register.error.website" })
    .optional()
    .or(z.literal("")),
  contactEmail: z
    .string()
    .email({ message: "register.error.contactEmail" })
    .optional()
    .or(z.literal("")),
  contactPhone: z
    .string()
    .regex(SLOVENIAN_PHONE_REGEX, {
      message: REGISTER_ERRORS.contactPhone,
    })
    .optional(),
});

export type ClubForm = z.infer<typeof clubSchema>;

export const getClubFormDefaults = (club?: ClubProfile | null): ClubForm => ({
  clubName: club?.clubName ?? "",
  country: club?.country ?? "",
  city: club?.city ?? "",
  league: club?.league ?? "",
  level: club?.level ?? "amateur",
  website: club?.website ?? "",
  contactEmail: club?.contactEmail ?? "",
  contactPhone: club?.contactPhone ?? "",
});

export const getUserFormDefaults = (user?: User | null) => ({
  firstName: user?.firstName ?? "",
  lastName: user?.lastName ?? "",
  phoneNumber: user?.phoneNumber ?? "",
  location: user?.location ?? "",
  nationality: user?.nationality ?? "",
  citizenship: user?.citizenship ?? "",
  email: user?.email ?? "",
});
export type UserForm = Pick<
  User,
  "firstName" | "lastName" | "phoneNumber" | "location" | "email"
>;
