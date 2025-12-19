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
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.instanceof(Date).nullable(),
  nationality: z.string().min(1, "Nationality is required"),
  heightCm: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(140, "Min 140cm").max(220, "Max 220cm")
  ),
  weightKg: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(40, "Min 40kg").max(150, "Max 150kg")
  ),
  preferredFoot: z.enum(["left", "right", "both"]),
  primaryPosition: z.string().min(1, "Primary position is required"),
  secondaryPositions: z.array(z.string()).optional(),
  experienceLevel: z.string().min(1, "Experience level is required"),
  currentClub: z.string().optional(),
  isFreeAgent: z.boolean().optional(),
  availabilityFrom: z.instanceof(Date).nullable(),
  location: z.string().optional(),
});

export type PlayerRegisterForm = z.infer<typeof playerRegisterSchema>;
