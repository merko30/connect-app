import { usersApi } from "@/api/auth";
import { AuthHeader } from "@/components/AuthHeader";
import { FormInput } from "@/components/FormInput";
import KeyboardAvoid from "@/components/KeyboardAvoid";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { REGISTER_ERRORS, SLOVENIAN_PHONE_REGEX } from "@/constants/validation";
import { useStyleThemed } from "@/theme";
import { ROLE_IDS } from "@/types/users";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

// ---- STRAPI AUTH REGISTRATION SCHEMA ----
const strapiRegisterSchema = z
  .object({
    firstName: z.string().min(1, {
      message: REGISTER_ERRORS.firstName,
    }),

    lastName: z.string().min(1, {
      message: REGISTER_ERRORS.lastName,
    }),

    username: z.string().min(3, {
      message: REGISTER_ERRORS.username,
    }),

    email: z.email({
      message: REGISTER_ERRORS.email,
    }),

    password: z.string().min(6, {
      message: REGISTER_ERRORS.password,
    }),
    isClubRegistration: z.boolean(),

    clubName: z.string().optional(),

    contactPhone: z
      .string()
      .regex(SLOVENIAN_PHONE_REGEX, {
        message: REGISTER_ERRORS.contactPhone,
      })
      .optional(),
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
      }
    }
  });
type StrapiRegisterForm = z.infer<typeof strapiRegisterSchema>;

export default function RegisterScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const { type } = useLocalSearchParams<{ type: "player" | "club" }>();

  const isClubRegistration = type === "club";

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: StrapiRegisterForm) => {
      const {
        contactPhone,
        clubName,
        isClubRegistration,
        ...registrationData
      } = data;
      return await usersApi.custom<{ jwt: string }>("/auth/local/register", {
        body: {
          ...registrationData,
          role: isClubRegistration ? ROLE_IDS.CLUB_STAFF : ROLE_IDS.PLAYER,
          ...(isClubRegistration ? { clubName, contactPhone } : {}),
        },
        method: "POST",
      });
    },
    onError: (error: { error: { details: { message: string } } }) => {
      const message = error.error?.details?.message;
      Toast.show({ type: "error", text1: message });
    },
    onSuccess: (data) => {
      AsyncStorage.setItem("token", data.jwt);
      queryClient.refetchQueries({ queryKey: ["current-user"] });
      router.navigate(isClubRegistration ? "/club/(tabs)" : "/player/(tabs)");
    },
  });

  const styles = useStyleThemed((t) => ({
    container: {
      flex: 1,
      padding: 24,
      paddingTop: 64,
      justifyContent: "center",
      backgroundColor: t.colors.background,
    },
    buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
    link: { alignItems: "center", marginTop: 4, paddingBottom: 24 },
    linkText: { color: t.colors.secondary, fontSize: 15, fontWeight: "500" },
    field: {},
    error: { color: "#ff5252", fontSize: 12, marginBottom: 4 },
  }));

  const form = useForm<StrapiRegisterForm>({
    resolver: zodResolver(strapiRegisterSchema) as any,
    defaultValues: {
      firstName: "Andrea",
      lastName: "Galliani",
      username: "andreagalliani",
      email: "andrea@example.com",
      password: "password",
      clubName: "AC Milan",
      contactPhone: "+38640123456",
      isClubRegistration,
    },
  });
  const { control, handleSubmit } = form;

  const onSubmit = async (data: StrapiRegisterForm) => {
    setError(null);
    mutate(data);
  };

  return (
    <FormProvider {...form}>
      <KeyboardAvoid>
        <ScrollView
          style={{ flex: 1, backgroundColor: "white", paddingTop: 72 }}
        >
          <View style={styles.container}>
            <AuthHeader
              title={t(
                isClubRegistration
                  ? "register.clubTitle"
                  : "register.playerTitle",
              )}
              caption={t(
                isClubRegistration
                  ? "register.clubCaption"
                  : "register.playerCaption",
              )}
            />

            <FormInput
              name="firstName"
              control={control}
              placeholder={t("register.firstName")}
              style={styles.field}
            />

            <FormInput
              name="lastName"
              control={control}
              placeholder={t("register.lastName")}
              style={styles.field}
            />

            <FormInput
              name="username"
              control={control}
              placeholder={t("register.username")}
              style={styles.field}
            />

            <FormInput
              name="email"
              control={control}
              placeholder={t("register.email")}
              keyboardType="email-address"
              style={styles.field}
            />

            <FormInput
              name="password"
              control={control}
              placeholder={t("register.password")}
              secureTextEntry
              style={styles.field}
            />

            {isClubRegistration && (
              <>
                <FormInput
                  name="clubName"
                  control={control}
                  placeholder={t("register.clubName")}
                  style={styles.field}
                />
                <FormInput
                  name="contactPhone"
                  control={control}
                  placeholder={t("register.contactPhone")}
                  keyboardType="phone-pad"
                  style={styles.field}
                />
              </>
            )}

            {error && <ThemedText style={styles.error}>{error}</ThemedText>}

            <ThemedButton
              title={t("register.register")}
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              loading={isPending}
              style={{ marginTop: 12 }}
            />

            <TouchableOpacity
              style={styles.link}
              onPress={() => router.navigate("/auth/login")}
            >
              <ThemedText style={styles.linkText}>
                {t("register.alreadyHaveAccount")}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoid>
    </FormProvider>
  );
}
