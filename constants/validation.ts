import { z } from "zod";

export const SLOVENIAN_PHONE_REGEX = /^((\+386|0)[1-9][0-9]{7,8})$/;

export const REGISTER_ERRORS = {
  firstName: "register.error.firstName",
  lastName: "register.error.lastName",
  username: "register.error.username",
  email: "register.error.email",
  password: "register.error.password",
  clubName: "register.error.clubName",
  contactPhone: "register.error.contactPhone",
};

// Phone number schema (regex validated contextually in superRefine for clubs)
export const phoneSchema = z.string().optional();

// Error message keys for translation

// ---- REUSABLE SCHEMA FIELDS ----
export const baseUserSchema = {
  firstName: z.string().min(1, {
    message: REGISTER_ERRORS.firstName,
  }),
  lastName: z.string().min(1, {
    message: REGISTER_ERRORS.lastName,
  }),
};

export const authCredentialsSchema = {
  ...baseUserSchema,
  username: z.string().min(3, {
    message: REGISTER_ERRORS.username,
  }),
  email: z.email({
    message: REGISTER_ERRORS.email,
  }),
  password: z.string().min(6, {
    message: REGISTER_ERRORS.password,
  }),
};

export const clubFieldsSchema = {
  clubName: z.string().optional(),
  contactPhone: phoneSchema,
};

// ---- FULL REGISTRATION SCHEMA ----
export const strapiRegisterSchema = z
  .object({
    ...authCredentialsSchema,
    isClubRegistration: z.boolean(),
    ...clubFieldsSchema,
  })
  .superRefine((data, ctx) => {
    if (data.isClubRegistration) {
      if (!data.clubName || data.clubName.trim().length === 0) {
        ctx.addIssue({
          path: ["clubName"],
          message: REGISTER_ERRORS.clubName,
          code: "custom",
        });
      }

      if (!data.contactPhone) {
        ctx.addIssue({
          path: ["contactPhone"],
          message: REGISTER_ERRORS.contactPhone,
          code: "custom",
        });
      } else if (!SLOVENIAN_PHONE_REGEX.test(data.contactPhone)) {
        ctx.addIssue({
          path: ["contactPhone"],
          message: REGISTER_ERRORS.contactPhone,
          code: "custom",
        });
      }
    }
  });

export type StrapiRegisterForm = z.infer<typeof strapiRegisterSchema>;

// ---- EDIT USER INFO SCHEMA ----
export const editUserInfoSchema = z.object({
  ...baseUserSchema,
  phoneNumber: phoneSchema,
  location: z.string().optional(),
  nationality: z.string().optional(),
  citizenship: z.string().optional(),
});

export type EditUserInfoForm = z.infer<typeof editUserInfoSchema>;
