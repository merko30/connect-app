import { recruitmentPostsApi } from "@/api/recruitment-posts";
import Header from "@/components/Header";
import useGetCurrentUser from "@/features/auth/hooks/useGetCurrentUser";
import {
  RecruitmentPostForm,
  RecruitmentPostFormValues,
} from "@/features/clubs/components/RecruitmentPostForm";
import { createStyle, useStyle } from "@/theme";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateRecruitmentPostScreen() {
  const { t } = useTranslation();
  const styles = useStyle(stylesheet);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: me } = useGetCurrentUser();

  const form = useForm<RecruitmentPostFormValues>({
    defaultValues: {
      title: "",
      type: "player",
      position: "",
      coachType: "",
      categories: [],
      note: "",
      level: "",
      postStatus: "open",
      deadline: null,
      contractType: "",
      requirements: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: RecruitmentPostFormValues) =>
      recruitmentPostsApi.create({
        title: values.title,
        type: values.type,
        position:
          values.type === "player" ? (values.position as any) || null : null,
        coachType:
          values.type === "coach" ? (values.coachType as any) || null : null,
        categories: values.type === "coach" ? values.categories : [],
        note: values.note || undefined,
        level: (values.level as any) || undefined,
        postStatus: (values.postStatus as any) || undefined,
        deadline: values.deadline
          ? values.deadline.toISOString().split("T")[0]
          : undefined,
        contractType: (values.contractType as any) || undefined,
        requirements: values.requirements || undefined,
        club: me?.club?.id as any,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruitment-posts"] });
      router.back();
    },
    onError: () => {
      Alert.alert(t("errorOccurred"));
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Header title={t("recruitmentPost.createTitle")} />
        <FormProvider {...form}>
          <RecruitmentPostForm
            submitLabel={t("recruitmentPost.publish")}
            onSubmit={mutate}
            isPending={isPending}
          />
        </FormProvider>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const stylesheet = createStyle((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.background,
  },
}));
