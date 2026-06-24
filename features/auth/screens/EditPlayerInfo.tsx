// Simple reusable input for react-hook-form
// Player position constants
import { playersApi } from "@/api/players";
import { FormDatePicker } from "@/components/FormDatepicker";
import { FormInput } from "@/components/FormInput";
import { FormPicker } from "@/components/FormPicker";
import Header from "@/components/Header";
import KeyboardAvoid from "@/components/KeyboardAvoid";
import MediaLinks from "@/components/MediaLinks";
import PositionPicker from "@/components/PositionPicker";
import RoleBasedButton from "@/components/RoleBasedButton";
import { ThemedText } from "@/components/ThemedText";
import FormerClubsFieldArray from "@/features/auth/components/FormerClubs";
import { createStyle, useStyle } from "@/theme";
import { ExperienceLevel, PlayerPosition } from "@/types/players";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Controller,
  FieldErrors,
  FormProvider,
  useForm,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView, Switch, useWindowDimensions, View } from "react-native";
import { TabBar, TabView } from "react-native-tab-view";
import Toast from "react-native-toast-message";
import {
  getPlayerRegisterDefaults,
  PlayerRegisterForm,
  playerRegisterSchema,
  PRIMARY_POSITIONS,
  TAB_ERROR_MAP,
} from "../constants";
import useGetCurrentUser from "../hooks/useGetCurrentUser";

export default function EditPlayerInfo() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ from?: string }>();
  const source = Array.isArray(params.from) ? params.from[0] : params.from;
  const isOnboarding = source === "app";
  const styles = useStyle(stylesheet);

  const { data: user } = useGetCurrentUser();

  const { mutate: updatePlayer } = useMutation({
    mutationFn: async (data: PlayerRegisterForm) => {
      await playersApi.update(user?.player?.documentId as string, {
        ...data,
        primaryPosition: data.primaryPosition as PlayerPosition,
        secondaryPositions: data.secondaryPositions as PlayerPosition[],
        experienceLevel: data.experienceLevel as ExperienceLevel,
        dateOfBirth: data.dateOfBirth?.toISOString().split("T")[0],
        availabilityFrom: data.availabilityFrom?.toISOString().split("T")[0],
        heightCm: Number(data.heightCm),
        weightKg: Number(data.weightKg),
      });
    },
    onError: (error: { error: { details: { message: string } } }) => {
      const message = error.error?.details?.message;

      Toast.show({ type: "error", text1: message });
    },
    onSuccess: () => {
      Toast.show({ type: "success", text1: t("auth.infoUpdated") });
      router.navigate(
        isOnboarding ? "/player/(tabs)" : "/player/(tabs)/profile",
      );
    },
  });

  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);

  const onInvalid = (errors: FieldErrors<PlayerRegisterForm>) => {
    const errorKeys = Object.keys(errors);

    const tabIndex = TAB_ERROR_MAP.findIndex((fields) =>
      fields.some((field) => errorKeys.includes(field)),
    );

    if (tabIndex >= 0) {
      setIndex(tabIndex);
    }
  };

  const routes = useMemo(
    () => [
      { key: "profile", title: t("mainInformation") },
      { key: "history", title: t("careerHistory") },
      { key: "media", title: t("profile.media") },
    ],
    [],
  );

  const form = useForm<PlayerRegisterForm>({
    resolver: zodResolver(playerRegisterSchema) as any,
    defaultValues: {
      ...getPlayerRegisterDefaults(user?.player),
    },
  });
  const { control, handleSubmit } = form;

  const onSubmit = (data: PlayerRegisterForm) => {
    updatePlayer(data);
  };

  const renderScene = useCallback(
    ({ route }: { route: { key: string; title: string } }) => {
      switch (route.key) {
        case "profile":
          return (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.tabContent}
            >
              <FormDatePicker
                control={control}
                name="dateOfBirth"
                label={t("register.dateOfBirth")}
              />

              <View style={styles.row}>
                <FormInput
                  control={control}
                  name="heightCm"
                  placeholder={t("register.height")}
                  keyboardType="numeric"
                  containerStyle={{ flex: 1 }}
                />

                <FormInput
                  control={control}
                  name="weightKg"
                  placeholder={t("register.weight")}
                  keyboardType="numeric"
                  containerStyle={{ flex: 1 }}
                />
              </View>

              <FormDatePicker
                control={control}
                name="availabilityFrom"
                label={t("register.availableFrom")}
              />

              <FormInput
                control={control}
                name="currentClub"
                placeholder={t("register.currentClub")}
              />

              <FormPicker
                control={control}
                name="preferredFoot"
                label={t("register.preferredFoot")}
                options={[
                  {
                    label: "register.left",
                    value: "left",
                  },
                  {
                    label: "register.right",
                    value: "right",
                  },
                ]}
              />

              <FormPicker
                control={control}
                name="primaryPosition"
                label={t("register.primaryPosition")}
                options={PRIMARY_POSITIONS.map((pos) => ({
                  label: pos,
                  value: pos,
                }))}
              />

              <PositionPicker />
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

              <Controller
                control={control}
                name="isFreeAgent"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.checkboxRow}>
                    <ThemedText>{t("register.isFreeAgent")}</ThemedText>

                    <Switch value={value} onValueChange={onChange} />
                  </View>
                )}
              />
            </ScrollView>
          );

        case "history":
          return (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.tabContent}
            >
              <FormerClubsFieldArray control={control} />
            </ScrollView>
          );

        case "media":
          return (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.tabContent}
            >
              <MediaLinks control={control} />
            </ScrollView>
          );

        default:
          return null;
      }
    },
    [control, t],
  );

  return (
    <FormProvider {...form}>
      <KeyboardAvoid style={styles.container}>
        {!isOnboarding && <Header title={t("auth.editPlayerInfo")} />}
        <ScrollView contentContainerStyle={styles.scrollContentContainer}>
          <TabView
            navigationState={{
              index,
              routes,
            }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{
              width: layout.width,
            }}
            lazy
            renderTabBar={(props) => (
              <TabBar
                {...props}
                style={styles.tabBar}
                indicatorStyle={styles.tabIndicator}
                activeColor={styles.tabActive.color}
                inactiveColor={styles.tabInactive.color}
                tabStyle={styles.tab}
              />
            )}
          />

          <RoleBasedButton
            title={t("save")}
            onPress={handleSubmit(onSubmit, onInvalid)}
            style={styles.saveButton}
          />
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
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  link: { alignItems: "center", marginTop: 4, paddingBottom: 24 },
  linkText: { color: t.colors.secondary, fontSize: 15, fontWeight: "500" },
  caption: {
    color: t.colors.surface,
    fontSize: 12,
    opacity: 0.7,
    maxWidth: 320,
  },
  tab: {
    flex: 1,
    width: "auto",
    alignItems: "center",
    justifyContent: "center",
  },
  tabContent: { padding: 12 },
  tabBar: { backgroundColor: t.colors.background },
  tabIndicator: { backgroundColor: t.colors.secondary },
  tabActive: { color: t.colors.text },
  tabInactive: { color: t.colors.text + "99" },
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
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 100,
  },
  saveButton: {
    marginTop: 12,
  },
}));
