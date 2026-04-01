import { usersApi } from "@/api/auth";
import { AuthHeader } from "@/components/AuthHeader";
import { FormError } from "@/components/FormError";
import { FormInput } from "@/components/FormInput";
import KeyboardAvoid from "@/components/KeyboardAvoid";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import {
  StrapiRegisterForm,
  strapiRegisterSchema,
} from "@/constants/validation";
import { TranslationKey } from "@/i18n";
import { createStyle, useStyle } from "@/theme";
import { ROLE_IDS, User } from "@/types/users";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

const REGISTER_RESPONSE_ERRORS: Record<string, TranslationKey> = {
  taken: "auth.taken",
  errorOccurred: "errorOccurred",
};

export default function RegisterScreenContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { type } = useLocalSearchParams<{ type: "player" | "club" }>();

  const queryClient = useQueryClient();

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
    onError: (error: { error: { message: string } }) => {
      console.log(error);

      const message = error.error?.message;
      if (message.includes("taken")) {
        Toast.show({
          type: "error",
          text1: t(REGISTER_RESPONSE_ERRORS["taken"]),
        });
      } else {
        Toast.show({
          type: "error",
          text1: t(REGISTER_RESPONSE_ERRORS["errorOccurred"]),
        });
      }
    },
    onSuccess: async (data) => {
      console.log(data);

      // Save token and then start subscription flow
      await AsyncStorage.setItem("token", data.jwt);

      const user = await usersApi.custom<User>("/users/me", {
        headers: {
          Authorization: `Bearer ${data.jwt}`,
        },
      });

      queryClient.setQueryData(["current-user"], user);

      router.push("/");
    },
  });

  const styles = useStyle(stylesheet);

  const form = useForm<StrapiRegisterForm>({
    resolver: zodResolver(strapiRegisterSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      clubName: "",
      contactPhone: "",
      isClubRegistration,
    },
  });
  const { control, handleSubmit } = form;

  const onSubmit = async (data: StrapiRegisterForm) => {
    setError(null);
    mutate(data);
  };

  console.log(form.formState.errors);

  return (
    <FormProvider {...form}>
      <KeyboardAvoid>
        <ScrollView style={styles.scrollView}>
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

            <FormError message={error} />

            <ThemedButton
              title={t("register.register")}
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              loading={isPending}
              style={styles.registerButton}
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

const stylesheet = createStyle((t) => ({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 64,
    justifyContent: "center",
    backgroundColor: t.colors.background,
  },
  scrollView: {
    flex: 1,
    paddingTop: 72,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  link: { alignItems: "center", marginTop: 4, paddingBottom: 24 },
  linkText: { color: t.colors.secondary, fontSize: 15, fontWeight: "500" },
  field: {},
  registerButton: { marginTop: 12 },
}));
