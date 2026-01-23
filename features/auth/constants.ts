// Slovenian phone number regex
import { ClubProfile } from "@/types/clubs";
import { PlayerProfile } from "@/types/players";
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

  formerClubs: [],

  isFreeAgent: player?.isFreeAgent ?? false,

  availabilityFrom: player?.availabilityFrom
    ? new Date(player.availabilityFrom)
    : null,
});

export const clubSchema = z.object({
  clubName: z.string().min(1, "Club name is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().optional(),
  league: z.string().optional(),
  level: z.enum(["amateur", "semi-pro", "pro"]),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  contactPhone: z.string().optional().or(z.literal("")),
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
