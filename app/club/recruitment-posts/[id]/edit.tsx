import { recruitmentPostsApi } from "@/api/recruitment-posts";
import Header from "@/components/Header";
import {
  RecruitmentPostForm,
  RecruitmentPostFormValues,
} from "@/features/clubs/components/RecruitmentPostForm";
import { createStyle, useStyle } from "@/theme";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title ?? "",
        type: post.type ?? "player",
        position: post.position ?? "",
        coachType: post.coachType ?? "",
        categories: post.categories ?? [],
        note: post.note ?? "",
        level: (post.level as string) ?? "",
        postStatus: (post.postStatus as string) ?? "open",
        deadline: post.deadline ? new Date(post.deadline) : null,
        contractType: (post.contractType as string) ?? "",
        requirements: post.requirements ?? "",
      });
    }
  }, [form, post]);

  const { mutate, isPending } = useMutation({
    mutationFn: (values: RecruitmentPostFormValues) =>
      recruitmentPostsApi.update(id, {
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
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruitment-posts"] });
      router.back();
    },
    onError: () => {
      Alert.alert(t("errorOccurred"));
    },
  });

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
        <RecruitmentPostForm
          submitLabel={t("recruitmentPost.save")}
          onSubmit={mutate}
          isPending={isPending}
        />
      </FormProvider>
    </SafeAreaView>
  );
}

const stylesheet = createStyle((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.background,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
}));
