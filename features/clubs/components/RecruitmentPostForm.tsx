import CategoriesSelector from "@/components/CategoriesSelector";
import { FormDatePicker } from "@/components/FormDatepicker";
import { FormInput } from "@/components/FormInput";
import { FormPicker } from "@/components/FormPicker";
import { ThemedButton } from "@/components/ThemedButton";
import { PRIMARY_POSITIONS } from "@/features/auth/constants";
import { createStyle, useStyle } from "@/theme";
import { RecruitmentPostType } from "@/types/recruitment-posts";
import React, { useCallback, useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Platform, ScrollView, View } from "react-native";

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
  const scrollRef = useRef<ScrollView>(null);
  const noteY = useRef(0);
  const requirementsY = useRef(0);

  const scrollToField = useCallback((y: number) => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        y: Math.max(y - 100, 0),
        animated: true,
      });
    });
  }, []);

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

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
      automaticallyAdjustKeyboardInsets
    >
      <FormInput
        control={form.control}
        name="title"
        placeholder={t("recruitmentPost.title")}
        multiline
        numberOfLines={2}
        style={styles.titleInput}
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

          <CategoriesSelector
            label={t("recruitmentPost.categories")}
            value={selectedCategories}
            onChange={(nextCategories) =>
              form.setValue("categories", nextCategories, {
                shouldDirty: true,
                shouldTouch: true,
              })
            }
          />
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

      <View
        onLayout={(event) => {
          noteY.current = event.nativeEvent.layout.y;
        }}
      >
        <FormInput
          control={form.control}
          name="note"
          placeholder={t("recruitmentPost.note")}
          multiline
          numberOfLines={3}
          style={styles.textArea}
          onFocus={() => scrollToField(noteY.current)}
        />
      </View>

      <View
        onLayout={(event) => {
          requirementsY.current = event.nativeEvent.layout.y;
        }}
      >
        <FormInput
          control={form.control}
          name="requirements"
          placeholder={t("recruitmentPost.requirements")}
          multiline
          numberOfLines={4}
          style={styles.textAreaLarge}
          onFocus={() => scrollToField(requirementsY.current)}
        />
      </View>

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
    paddingBottom: t.spacing.xl * 5,
  },
  titleInput: {
    minHeight: 72,
  },
  textArea: {
    minHeight: 96,
  },
  textAreaLarge: {
    minHeight: 120,
  },
  submitButton: {
    marginTop: t.spacing.md,
  },
}));
