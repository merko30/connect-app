import { coachesApi } from "@/api/coaches";
import { FormDatePicker } from "@/components/FormDatepicker";
import { FormInput } from "@/components/FormInput";
import { FormPicker } from "@/components/FormPicker";
import Header from "@/components/Header";
import KeyboardAvoid from "@/components/KeyboardAvoid";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import FormerClubsFieldArray from "@/features/auth/components/FormerClubs";
import { createStyle, useStyle } from "@/theme";
import {
  CoachExperienceLevel,
  CoachLicenseLevel,
  CoachType,
  CoachVisibility,
} from "@/types/coaches";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView, Switch, View } from "react-native";
import Toast from "react-native-toast-message";
import {
  CoachRegisterForm,
  coachRegisterSchema,
  getCoachRegisterDefaults,
} from "../constants";
import useGetCurrentUser from "../hooks/useGetCurrentUser";

export default function EditCoachInfo() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ from?: string }>();
  const source = Array.isArray(params.from) ? params.from[0] : params.from;
  const isOnboarding = source === "app";
  const styles = useStyle(stylesheet);

  const { data: user } = useGetCurrentUser();

  const { mutate: saveCoach, isPending } = useMutation({
    mutationFn: async (data: CoachRegisterForm) => {
      const payload = {
        ...data,
        coachType: data.coachType as CoachType,
        licenseLevel: (data.licenseLevel as CoachLicenseLevel) || undefined,
        experienceLevel:
          (data.experienceLevel as CoachExperienceLevel) || undefined,
        visibility: data.visibility as CoachVisibility,
        dateOfBirth: data.dateOfBirth?.toISOString().split("T")[0],
        availableFrom: data.availableFrom?.toISOString().split("T")[0],
        yearsOfExperience: data.yearsOfExperience
          ? Number(data.yearsOfExperience)
          : undefined,
        categories: data.categories
          ? data.categories
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        formerClubs:
          data.formerClubs?.filter((club) => club.name?.trim().length > 0) ??
          [],
        user: user?.id as any,
      };

      if (user?.coach?.documentId) {
        await coachesApi.update(user.coach.documentId, payload);
        return;
      }

      // await coachesApi.create(payload);
    },
    onError: (error: { error?: { details?: { message?: string } } }) => {
      const message = error.error?.details?.message ?? t("errorOccurred");
      Toast.show({ type: "error", text1: message });
    },
    onSuccess: () => {
      Toast.show({ type: "success", text1: t("auth.infoUpdated") });
      router.navigate(
        isOnboarding ? "/player/(tabs)" : "/player/(tabs)/profile",
      );
    },
  });

  const form = useForm<CoachRegisterForm>({
    resolver: zodResolver(coachRegisterSchema) as any,
    defaultValues: getCoachRegisterDefaults(user?.coach, user),
  });
  const { control, handleSubmit } = form;

  const onSubmit = (data: CoachRegisterForm) => {
    saveCoach(data);
  };

  return (
    <FormProvider {...form}>
      <KeyboardAvoid style={styles.container}>
        {!isOnboarding && <Header title={t("profile.editCoachInfo")} />}
        <ScrollView contentContainerStyle={styles.scrollContentContainer}>
          <View style={styles.container}>
            <View style={styles.row}>
              <FormInput
                control={control}
                name="firstName"
                placeholder={t("register.firstName")}
                containerStyle={{ flex: 1 }}
              />
              <FormInput
                control={control}
                name="lastName"
                placeholder={t("register.lastName")}
                containerStyle={{ flex: 1 }}
              />
            </View>

            <FormPicker
              control={control}
              name="coachType"
              label={t("register.coachType")}
              options={[
                { label: "coachTypes.head-coach", value: "head-coach" },
                {
                  label: "coachTypes.assistant-coach",
                  value: "assistant-coach",
                },
                {
                  label: "coachTypes.goalkeeping-coach",
                  value: "goalkeeping-coach",
                },
                { label: "coachTypes.fitness-coach", value: "fitness-coach" },
                { label: "coachTypes.analyst", value: "analyst" },
              ]}
            />

            <FormPicker
              control={control}
              name="licenseLevel"
              label={t("register.licenseLevel")}
              options={[
                { label: "licenseLevels.none", value: "none" },
                { label: "licenseLevels.uefa-c", value: "uefa-c" },
                { label: "licenseLevels.uefa-b", value: "uefa-b" },
                { label: "licenseLevels.uefa-a", value: "uefa-a" },
                { label: "licenseLevels.uefa-pro", value: "uefa-pro" },
              ]}
            />

            <FormPicker
              control={control}
              name="experienceLevel"
              label={t("register.experienceLevel")}
              options={[
                { label: "experienceLevels.youth", value: "youth" },
                { label: "experienceLevels.amateur", value: "amateur" },
                { label: "experienceLevels.semi-pro", value: "semi-pro" },
                { label: "experienceLevels.pro", value: "pro" },
              ]}
            />

            <FormDatePicker
              control={control}
              name="dateOfBirth"
              label={t("register.dateOfBirth")}
            />

            <FormInput
              control={control}
              name="currentClub"
              placeholder={t("register.currentClub")}
            />

            <FormInput
              control={control}
              name="yearsOfExperience"
              placeholder={t("register.yearsOfExperience")}
              keyboardType="numeric"
            />

            <FormInput
              control={control}
              name="location"
              placeholder={t("register.location")}
            />

            <FormInput
              control={control}
              name="nationality"
              placeholder={t("register.nationality")}
            />

            <FormInput
              control={control}
              name="contactEmail"
              placeholder={t("register.contactEmail")}
              keyboardType="email-address"
            />

            <FormInput
              control={control}
              name="contactPhone"
              placeholder={t("register.contactPhone")}
              keyboardType="phone-pad"
            />

            <FormInput
              control={control}
              name="categories"
              placeholder={t("register.categories")}
            />

            <FormerClubsFieldArray control={control as any} />

            <FormDatePicker
              control={control}
              name="availableFrom"
              label={t("register.availableFrom")}
            />

            <Controller
              control={control}
              name="isAvailable"
              render={({ field: { onChange, value } }) => (
                <View style={styles.checkboxRow}>
                  <ThemedText>{t("register.isAvailable")}</ThemedText>
                  <Switch value={!!value} onValueChange={onChange} />
                </View>
              )}
            />

            <FormInput
              control={control}
              name="bio"
              placeholder={t("register.bio")}
              multiline
              numberOfLines={5}
            />

            <ThemedButton
              title={t("save")}
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              style={styles.saveButton}
              loading={isPending}
            />
          </View>
        </ScrollView>
      </KeyboardAvoid>
    </FormProvider>
  );
}

const stylesheet = createStyle((t) => ({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: t.colors.background,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 100,
  },
  saveButton: {
    marginTop: 12,
  },
}));
