// Simple reusable input for react-hook-form
// Player position constants
import { AuthHeader } from "@/components/AuthHeader";
import { FormDatePicker } from "@/components/FormDatepicker";
import { FormInput } from "@/components/FormInput";
import { FormPicker } from "@/components/FormPicker";
import KeyboardAvoid from "@/components/KeyboardAvoid";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { useStyleThemed } from "@/theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView, Switch, TouchableOpacity, View } from "react-native";
import {
  PlayerRegisterForm,
  playerRegisterSchema,
  PRIMARY_POSITIONS,
  SECONDARY_POSITIONS,
} from "../constants";

export default function RegisterScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [formState, setFormState] = useState<PlayerRegisterForm | null>(null);
  const styles = useStyleThemed((t) => ({
    container: {
      flex: 1,
      padding: 24,
      paddingTop: 64,
      backgroundColor: t.colors.background,
    },
    buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
    link: { alignItems: "center", marginTop: 4, paddingBottom: 24 },
    linkText: { color: t.colors.secondary, fontSize: 15, fontWeight: "500" },
    caption: {
      color: t.colors.surface,
      fontSize: 12,
      opacity: 0.7,
      maxWidth: 320,
    },
    field: { marginBottom: 12 },
    error: { color: "#ff5252", fontSize: 12, marginBottom: 4 },
    row: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
    col: { flex: 1 },
    select: {
      color: t.colors.text,
      borderRadius: 8,
      fontSize: 16,
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: t.colors.text + "33",
      borderRadius: 8,
      marginTop: 4,
    },
    checkboxRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 12,
    },
    item: {
      height: 50,
    },
  }));

  const form = useForm<PlayerRegisterForm>({
    resolver: zodResolver(playerRegisterSchema) as any, // type workaround for zodResolver
    defaultValues: {
      dateOfBirth: new Date(),
      availabilityFrom: new Date(),
    },
  });
  const { control, handleSubmit, getValues } = form;

  const onSubmit = (data: PlayerRegisterForm) => {
    setFormState(data);
    // TODO: handle registration logic (API call, etc.)
    console.log(data);
  };

  console.log(getValues());

  return (
    <FormProvider {...form}>
      <KeyboardAvoid>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          <View style={styles.container}>
            <AuthHeader
              title={t("register.title")}
              caption={t("register.caption")}
            />

            <FormInput
              name="firstName"
              control={control}
              placeholder={t("register.firstName")}
            />

            <FormInput
              control={control}
              name="lastName"
              placeholder={t("register.lastName")}
            />

            <FormDatePicker
              control={control}
              name="dateOfBirth"
              label={t("register.dateOfBirth")}
              placeholder={t("register.dateOfBirthPlaceholder")}
            />

            {/* Nationality */}
            {/* TODO: ADD PICKER */}
            <FormInput
              control={control}
              name="nationality"
              placeholder={t("register.nationality")}
            />

            {/* Height and Weight */}
            <View style={styles.row}>
              <FormInput
                control={control}
                name="heightCm"
                placeholder={t("register.height")}
                keyboardType="numeric"
                style={{ flex: 1 }}
              />
              <FormInput
                control={control}
                name="weightKg"
                placeholder={t("register.weight")}
                keyboardType="numeric"
                style={{ flex: 1 }}
              />
            </View>

            <FormDatePicker
              control={control}
              name="availabilityFrom"
              label={t("register.availableFrom")}
            />

            {/* Location */}
            <FormInput
              control={control}
              name="location"
              placeholder={t("register.location")}
            />

            {/* Current Club */}
            <FormInput
              control={control}
              name="currentClub"
              placeholder={t("register.currentClub")}
            />

            {/* Preferred Foot */}
            <FormPicker
              control={control}
              name="preferredFoot"
              label={t("register.preferredFoot")}
              options={[
                {
                  label: t("register.left"),
                  value: "left",
                },
                {
                  label: t("register.right"),
                  value: "right",
                },
              ]}
            />

            {/* Primary Position */}
            <FormPicker
              control={control}
              name="primaryPosition"
              label={t("register.primaryPosition")}
              options={PRIMARY_POSITIONS.map((pos) => ({
                label: pos,
                value: pos,
              }))}
            />

            {/* Secondary Positions (multi-select) */}
            <FormPicker
              control={control}
              name="secondaryPositions"
              label={t("register.secondaryPosition")}
              options={SECONDARY_POSITIONS.map((pos) => ({
                label: pos,
                value: pos,
              }))}
            />

            {/* Experience Level */}
            <FormPicker
              control={control}
              name="experienceLevel"
              label={t("register.experienceLevel")}
              options={[
                { label: t("register.youth"), value: "youth" },
                { label: t("register.amateur"), value: "amateur" },
                { label: t("register.semiPro"), value: "semi-pro" },
                { label: t("register.pro"), value: "pro" },
              ]}
            />

            {/* Free Agent Checkbox */}
            <Controller
              control={control}
              name="isFreeAgent"
              render={({ field: { onChange, value } }) => (
                <View style={styles.checkboxRow}>
                  <ThemedText>{t("register.isFreeAgent")}</ThemedText>
                  <Switch
                    value={value}
                    onValueChange={(value) => onChange(value)}
                  />
                </View>
              )}
            />

            <ThemedButton
              title={t("register.register")}
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              style={{ marginTop: 12 }}
            />

            {/* Debug: Show saved form state */}
            {formState && (
              <View style={{ marginTop: 16 }}>
                <ThemedText variant="caption">
                  {t("register.savedFormData")}
                </ThemedText>
                <ThemedText style={{ fontSize: 12, color: "#888" }}>
                  {JSON.stringify(formState, null, 2)}
                </ThemedText>
              </View>
            )}
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
