import { ThemedText } from "@/components/ThemedText";
import SettingsScreenLayout from "@/features/auth/components/SettingsScreenLayout";
import SettingsSectionCard from "@/features/auth/components/SettingsSectionCard";
import { createStyle, useStyle } from "@/theme";
import { AppearanceMode, useAppearanceSettings } from "@/theme/appearance";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

const OPTIONS: {
  value: AppearanceMode;
  labelKey: "appearance.system" | "appearance.light" | "appearance.dark";
  descriptionKey:
    | "appearance.systemDescription"
    | "appearance.lightDescription"
    | "appearance.darkDescription";
}[] = [
  {
    value: "system",
    labelKey: "appearance.system",
    descriptionKey: "appearance.systemDescription",
  },
  {
    value: "light",
    labelKey: "appearance.light",
    descriptionKey: "appearance.lightDescription",
  },
  {
    value: "dark",
    labelKey: "appearance.dark",
    descriptionKey: "appearance.darkDescription",
  },
];

export default function AppearanceSettingsScreen() {
  const { t } = useTranslation();
  const styles = useStyle(stylesheet);
  const { mode, setMode } = useAppearanceSettings();

  return (
    <SettingsScreenLayout
      headerTitle={t("profile.appearance")}
      title={t("appearance.title")}
      subtitle={t("appearance.subtitle")}
    >
      <SettingsSectionCard title={t("appearance.theme")}>
        {OPTIONS.map((option) => {
          const isSelected = option.value === mode;

          return (
            <Pressable
              key={option.value}
              onPress={() => void setMode(option.value)}
              style={[styles.option, isSelected && styles.optionSelected]}
            >
              <View style={styles.optionText}>
                <ThemedText style={styles.optionLabel}>
                  {t(option.labelKey)}
                </ThemedText>
                <ThemedText style={styles.optionDescription}>
                  {t(option.descriptionKey)}
                </ThemedText>
              </View>

              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected ? <View style={styles.radioInner} /> : null}
              </View>
            </Pressable>
          );
        })}
      </SettingsSectionCard>
    </SettingsScreenLayout>
  );
}

const stylesheet = createStyle((t) => ({
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: t.spacing.sm,
    paddingHorizontal: t.spacing.sm,
    borderWidth: 1,
    borderColor: t.colors.spacer,
    borderRadius: t.radii.md,
    gap: t.spacing.md,
  },
  optionSelected: {
    borderColor: t.colors.primary,
    backgroundColor: t.colors.background,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontWeight: "600",
    marginBottom: 2,
  },
  optionDescription: {
    color: t.colors.gray[500],
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: t.colors.gray[300],
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: t.colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: t.colors.primary,
  },
}));
