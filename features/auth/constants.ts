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
  nationality: z.string().min(1, "Nationality is required"),
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
  availabilityFrom: z.instanceof(Date),
  location: z.string().optional(),
});

export type PlayerRegisterForm = z.infer<typeof playerRegisterSchema>;
