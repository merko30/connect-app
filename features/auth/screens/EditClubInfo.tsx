import { clubsApi } from "@/api/clubs";
import { FormInput } from "@/components/FormInput";
import { FormPicker } from "@/components/FormPicker";
import Header from "@/components/Header";
import KeyboardAvoid from "@/components/KeyboardAvoid";
import { ThemedButton } from "@/components/ThemedButton";
import { createStyle, useStyle } from "@/theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";
import Toast from "react-native-toast-message";
import { ClubForm, clubSchema, getClubFormDefaults } from "../constants";
import useGetCurrentUser from "../hooks/useGetCurrentUser";

export default function EditPlayerInfo() {
  const { t } = useTranslation();
  const router = useRouter();
  const styles = useStyle(stylesheet);

  const { data: user } = useGetCurrentUser();

  const { mutate: updateClub } = useMutation({
    mutationFn: async (data: ClubForm) => {
      await clubsApi.update(user?.club?.documentId as string, {
        ...data,
      });
    },
    onError: (error: { error: { details: { message: string } } }) => {
      const message = error.error?.details?.message;

      Toast.show({ type: "error", text1: message });
    },
    onSuccess: () => router.navigate("/club/(tabs)/profile"),
  });

  const form = useForm<ClubForm>({
    resolver: zodResolver(clubSchema) as any,
    defaultValues: {
      ...getClubFormDefaults(user?.club),
    },
  });
  const { control, handleSubmit } = form;

  const onSubmit = (data: ClubForm) => {
    updateClub(data);
  };

  return (
    <FormProvider {...form}>
      <KeyboardAvoid style={{ flex: 1 }}>
        <Header title={t("auth.editClubInfo")} />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <FormInput
            control={control}
            name="clubName"
            placeholder={t("register.clubName")}
            style={styles.field}
          />

          <FormInput
            control={control}
            name="country"
            placeholder={t("register.country")}
            style={styles.field}
          />

          <FormInput
            control={control}
            name="city"
            placeholder={t("register.city")}
            style={styles.field}
          />

          <FormInput
            control={control}
            name="league"
            placeholder={t("register.league")}
            style={styles.field}
          />

          <FormPicker
            control={control}
            name="level"
            placeholder={t("register.level")}
            options={[
              { label: t("register.amateur"), value: "amateur" },
              { label: t("register.semiPro"), value: "semi-pro" },
              { label: t("register.pro"), value: "pro" },
            ]}
            style={styles.field}
          />

          <FormInput
            control={control}
            name="website"
            placeholder={t("register.website")}
            style={styles.field}
          />

          <FormInput
            control={control}
            name="contactEmail"
            placeholder={t("register.contactEmail")}
            style={styles.field}
          />

          <FormInput
            control={control}
            name="contactPhone"
            placeholder={t("register.contactPhone")}
            style={styles.field}
          />

          <ThemedButton
            title={t("save")}
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            style={{ marginTop: 12 }}
          />
        </ScrollView>
      </KeyboardAvoid>
    </FormProvider>
  );
}

const stylesheet = createStyle((t) => ({
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 100,
    backgroundColor: t.colors.background,
  },
  container: {
    flex: 1,
    padding: 24,
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
  row: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
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
