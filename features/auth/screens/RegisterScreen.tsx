// Simple reusable input for react-hook-form
// Player position constants
import { AuthHeader } from "@/components/AuthHeader";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";

import { FormDatePicker } from "@/components/FormDatepicker";
import { FormInput } from "@/components/FormInput";
import { FormPicker } from "@/components/FormPicker";
import { useStyleThemed } from "@/theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { ScrollView, Switch, TouchableOpacity, View } from "react-native";
import {
  PlayerRegisterForm,
  playerRegisterSchema,
  PRIMARY_POSITIONS,
  SECONDARY_POSITIONS,
} from "../constants";

export default function RegisterScreen() {
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
    link: { alignItems: "center" },
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
      preferredFoot: "right",
      dateOfBirth: new Date(),
      isFreeAgent: false,
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
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
        }}
      >
        <View style={styles.container}>
          <AuthHeader
            title="Player Registration"
            caption="Create your player profile to join the community and connect with clubs."
          />

          <FormInput
            name="firstName"
            control={control}
            placeholder="First Name"
          />

          <FormInput
            control={control}
            name="lastName"
            placeholder="Last Name"
          />

          <FormDatePicker
            control={control}
            name="dateOfBirth"
            label="Date of birth"
            placeholder="Date of Birth (YYYY-MM-DD)"
          />

          {/* Nationality */}
          {/* TODO: ADD PICKER */}
          <FormInput
            control={control}
            name="nationality"
            placeholder="Nationality"
          />

          {/* Height and Weight */}
          <View style={styles.row}>
            <FormInput
              control={control}
              name="heightCm"
              placeholder="Height (cm)"
              keyboardType="numeric"
              style={{ flex: 1 }}
            />
            <FormInput
              control={control}
              name="weightKg"
              placeholder="Weight (kg)"
              keyboardType="numeric"
              style={{ flex: 1 }}
            />
          </View>

          <FormDatePicker
            control={control}
            name="availabilityFrom"
            label="Available from"
          />

          {/* Location */}
          <FormInput
            control={control}
            name="location"
            placeholder="Location (optional)"
          />

          {/* Current Club */}
          <FormInput
            control={control}
            name="currentClub"
            placeholder="Current Club (optional)"
          />

          {/* Preferred Foot */}
          <FormPicker
            control={control}
            name="preferredFoot"
            label="Prefered foot"
            options={[
              {
                label: "Left",
                value: "left",
              },
              {
                label: "Right",
                value: "right",
              },
            ]}
          />

          {/* Primary Position */}
          <FormPicker
            control={control}
            name="primaryPosition"
            label="Primary position"
            options={PRIMARY_POSITIONS.map((pos) => ({
              label: pos,
              value: pos,
            }))}
          />

          {/* Secondary Positions (multi-select) */}
          <FormPicker
            control={control}
            name="secondaryPositions"
            label="Secondary position"
            options={SECONDARY_POSITIONS.map((pos) => ({
              label: pos,
              value: pos,
            }))}
          />

          {/* Experience Level */}
          <FormPicker
            control={control}
            name="experienceLevel"
            label="Experience Level"
            options={[
              { label: "Beginner", value: "Beginner" },
              { label: "Intermediate", value: "Intermediate" },
              { label: "Advanced", value: "Advanced" },
              { label: "Professional", value: "Professional" },
            ]}
          />

          {/* Free Agent Checkbox */}
          <Controller
            control={control}
            name="isFreeAgent"
            render={({ field: { onChange, value } }) => (
              <View style={styles.checkboxRow}>
                <ThemedText>Is Free Agent</ThemedText>
                <Switch
                  value={value}
                  onValueChange={(value) => onChange(value)}
                />
              </View>
            )}
          />

          <ThemedButton
            title="Register"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            style={{ marginTop: 12 }}
          />

          {/* Debug: Show saved form state */}
          {formState && (
            <View style={{ marginTop: 16 }}>
              <ThemedText variant="caption">Saved form data:</ThemedText>
              <ThemedText style={{ fontSize: 12, color: "#888" }}>
                {JSON.stringify(formState, null, 2)}
              </ThemedText>
            </View>
          )}
          <ThemedText variant="caption" style={styles.caption}>
            By registering, you agree to our Terms of Service and Privacy
            Policy.
          </ThemedText>
          <TouchableOpacity
            style={styles.link}
            onPress={() => router.navigate("/auth/login")}
          >
            <ThemedText style={styles.linkText}>
              Already have an account? Login
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </FormProvider>
  );
}
