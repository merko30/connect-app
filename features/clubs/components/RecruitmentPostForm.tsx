import { FormDatePicker } from "@/components/FormDatepicker";
import { FormInput } from "@/components/FormInput";
import { FormPicker } from "@/components/FormPicker";
import { ThemedButton } from "@/components/ThemedButton";
import { PRIMARY_POSITIONS } from "@/features/auth/constants";
import { createStyle, useStyle } from "@/theme";
import { RecruitmentPostType } from "@/types/recruitment-posts";
import React, { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export type RecruitmentPostFormValues = {
  title: string;
  type: RecruitmentPostType;
  position: string;
  coachType: string;
  categories: string[];
  note: string;
  level: string;
  postStatus: string;
  deadline: Date | null;
  contractType: string;
  requirements: string;
};

type RecruitmentPostFormProps = {
  isPending?: boolean;
  submitLabel: string;
  onSubmit: (values: RecruitmentPostFormValues) => void;
};

const CATEGORY_OPTIONS = ["u9", "u12", "u15", "u17", "u19", "senior"];

const typeOptions = [
  { label: "player", value: "player" },
  { label: "coach", value: "coach" },
];

const positionOptions = PRIMARY_POSITIONS.map((p) => ({
  label: p,
  value: p,
}));

const coachTypeOptions = [
  { label: "coachTypes.head-coach", value: "head-coach" },
  { label: "coachTypes.assistant-coach", value: "assistant-coach" },
  { label: "coachTypes.goalkeeping-coach", value: "goalkeeping-coach" },
  { label: "coachTypes.fitness-coach", value: "fitness-coach" },
  { label: "coachTypes.analyst", value: "analyst" },
];

const levelOptions = [
  { label: "experienceLevels.youth", value: "youth" },
  { label: "experienceLevels.amateur", value: "amateur" },
  { label: "experienceLevels.semi-pro", value: "semi-pro" },
  { label: "experienceLevels.pro", value: "pro" },
];

const contractTypeOptions = [
  { label: "contractTypes.trial", value: "trial" },
  { label: "contractTypes.short-term", value: "short-term" },
  { label: "contractTypes.full-season", value: "full-season" },
  { label: "contractTypes.permanent", value: "permanent" },
];

export function RecruitmentPostForm({
  isPending,
  submitLabel,
  onSubmit,
}: RecruitmentPostFormProps) {
  const { t } = useTranslation();
  const styles = useStyle(stylesheet);
  const form = useFormContext<RecruitmentPostFormValues>();

  const selectedType = useWatch({
    control: form.control,
    name: "type",
    defaultValue: "player",
  });

  const selectedCategories = useWatch({
    control: form.control,
    name: "categories",
    defaultValue: [],
  });

  useEffect(() => {
    if (selectedType === "player") {
      if (form.getValues("coachType")) {
        form.setValue("coachType", "");
      }

      const categories = form.getValues("categories") ?? [];
      if (categories.length) {
        form.setValue("categories", []);
      }

      return;
    }

    if (form.getValues("position")) {
      form.setValue("position", "");
    }
  }, [form, selectedType]);

  const toggleCategory = (category: string) => {
    const nextCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((item) => item !== category)
      : [...selectedCategories, category];

    form.setValue("categories", nextCategories, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <FormInput
        control={form.control}
        name="title"
        placeholder={t("recruitmentPost.title")}
      />

      <FormPicker
        control={form.control}
        name="type"
        label={t("recruitmentPost.type")}
        options={typeOptions}
      />

      {selectedType === "player" ? (
        <FormPicker
          control={form.control}
          name="position"
          label={t("recruitmentPost.position")}
          options={positionOptions}
        />
      ) : (
        <>
          <FormPicker
            control={form.control}
            name="coachType"
            label={t("register.coachType")}
            options={coachTypeOptions}
          />

          <View style={styles.categoriesSection}>
            <Text style={styles.categoriesLabel}>
              {t("recruitmentPost.categories")}
            </Text>
            <View style={styles.chipsWrap}>
              {CATEGORY_OPTIONS.map((category) => {
                const isSelected = selectedCategories.includes(category);

                return (
                  <TouchableOpacity
                    key={category}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => toggleCategory(category)}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextSelected,
                      ]}
                    >
                      {category === "senior"
                        ? "Senior"
                        : category.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </>
      )}

      <FormPicker
        control={form.control}
        name="contractType"
        label={t("recruitmentPost.contractType")}
        options={contractTypeOptions}
      />

      <FormPicker
        control={form.control}
        name="level"
        label={t("recruitmentPost.level")}
        options={levelOptions}
      />

      <FormDatePicker
        control={form.control}
        name="deadline"
        label={t("recruitmentPost.deadline")}
      />

      <FormInput
        control={form.control}
        name="note"
        placeholder={t("recruitmentPost.note")}
        multiline
        numberOfLines={3}
      />

      <FormInput
        control={form.control}
        name="requirements"
        placeholder={t("recruitmentPost.requirements")}
        multiline
        numberOfLines={4}
      />

      <ThemedButton
        title={submitLabel}
        onPress={form.handleSubmit(onSubmit)}
        loading={isPending}
        style={styles.submitButton}
      />
    </ScrollView>
  );
}

const stylesheet = createStyle((t) => ({
  scroll: {
    flex: 1,
  },
  content: {
    padding: t.spacing.lg,
    paddingBottom: t.spacing.xl,
  },
  categoriesSection: {
    marginBottom: t.spacing.sm,
  },
  categoriesLabel: {
    color: t.colors.text,
    marginBottom: t.spacing.xs,
    fontWeight: "600",
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    paddingHorizontal: t.spacing.sm,
    paddingVertical: t.spacing.xs,
    borderRadius: t.radii.full,
    borderWidth: 1,
    borderColor: t.colors.text + "22",
    backgroundColor: t.colors.surface,
    marginRight: t.spacing.xs,
    marginBottom: t.spacing.xs,
  },
  chipSelected: {
    backgroundColor: t.colors.primary,
    borderColor: t.colors.primary,
  },
  chipText: {
    color: t.colors.text,
    fontWeight: "500",
  },
  chipTextSelected: {
    color: "#fff",
  },
  submitButton: {
    marginTop: t.spacing.md,
  },
}));
