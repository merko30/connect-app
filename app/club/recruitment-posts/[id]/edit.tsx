import { recruitmentPostsApi } from "@/api/recruitment-posts";
import { FormDatePicker } from "@/components/FormDatepicker";
import { FormInput } from "@/components/FormInput";
import { FormPicker } from "@/components/FormPicker";
import Header from "@/components/Header";
import { ThemedButton } from "@/components/ThemedButton";
import { PRIMARY_POSITIONS } from "@/features/auth/constants";
import { createStyle, useStyle } from "@/theme";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FormValues = {
  title: string;
  position: string;
  note: string;
  level: string;
  postStatus: string;
  deadline: Date | null;
  contractType: string;
  requirements: string;
};

export default function EditRecruitmentPostScreen() {
  const { t } = useTranslation();
  const styles = useStyle(stylesheet);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: postData, isPending: isLoading } = useQuery({
    queryKey: ["recruitment-posts", id],
    queryFn: () => recruitmentPostsApi.get(id),
    enabled: !!id,
  });

  const post = postData?.data;

  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      position: "",
      note: "",
      level: "",
      postStatus: "open",
      deadline: null,
      contractType: "",
      requirements: "",
    },
  });

  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title ?? "",
        position: post.position ?? "",
        note: post.note ?? "",
        level: (post.level as string) ?? "",
        postStatus: (post.postStatus as string) ?? "open",
        deadline: post.deadline ? new Date(post.deadline) : null,
        contractType: (post.contractType as string) ?? "",
        requirements: post.requirements ?? "",
      });
    }
  }, [post]);

  const { mutate, isPending } = useMutation({
    mutationFn: (values: FormValues) =>
      recruitmentPostsApi.update(id, {
        title: values.title,
        position: values.position as any,
        note: values.note || undefined,
        level: (values.level as any) || undefined,
        postStatus: (values.postStatus as any) || undefined,
        deadline: values.deadline
          ? values.deadline.toISOString().split("T")[0]
          : undefined,
        contractType: (values.contractType as any) || undefined,
        requirements: values.requirements || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruitment-posts"] });
      router.back();
    },
    onError: () => {
      Alert.alert(t("errorOccurred"));
    },
  });

  const positionOptions = PRIMARY_POSITIONS.map((p) => ({
    label: p,
    value: p,
  }));

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

  if (isLoading) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={["left", "right", "bottom"]}
      >
        <Header title={t("recruitmentPost.editTitle")} />
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <Header title={t("recruitmentPost.editTitle")} />
      <FormProvider {...form}>
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
            name="position"
            label={t("recruitmentPost.position")}
            options={positionOptions}
          />

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
            title={t("recruitmentPost.save")}
            onPress={form.handleSubmit((v) => mutate(v))}
            loading={isPending}
            style={styles.submitButton}
          />
        </ScrollView>
      </FormProvider>
    </SafeAreaView>
  );
}

const stylesheet = createStyle((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: t.spacing.lg,
    paddingBottom: t.spacing.xl,
  },
  submitButton: {
    marginTop: t.spacing.md,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
}));
