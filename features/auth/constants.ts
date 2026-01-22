// Slovenian phone number regex
import { PlayerProfile } from "@/types/players";
import * as z from "zod";
export const SLOVENIAN_PHONE_REGEX = /^((\+386|0)[1-9][0-9]{7,8})$/;

// Error message keys for translation
export const REGISTER_ERRORS = {
  firstName: "register.error.firstName",
  lastName: "register.error.lastName",
  username: "register.error.username",
  email: "register.error.email",
  password: "register.error.password",
  clubName: "register.error.clubName",
  contactPhone: "register.error.contactPhone",
};

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
