import { recruitmentPostsApi } from "@/api/recruitment-posts";
import Header from "@/components/Header";
import { ThemedText } from "@/components/ThemedText";
import { CircleIconButton } from "@/components/ui/CircleIconButton";
import useGetCurrentUser from "@/features/auth/hooks/useGetCurrentUser";
import { RecruitmentPostCard } from "@/features/players/components/RecruitmentPostCard";
import { createStyle, useStyle } from "@/theme";
import { RecruitmentPost } from "@/types/recruitment-posts";
import { StrapiListResponse } from "@/types/strapi";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ClubPostsScreen() {
  const { t } = useTranslation();
  const styles = useStyle(stylesheet);
  const { data: me } = useGetCurrentUser();
  const clubId = me?.club?.documentId ?? me?.club?.id;
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: deletePost } = useMutation({
    mutationFn: (id: string | number) => recruitmentPostsApi.remove(id as any),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recruitment-posts", "mine", clubId],
      });
    },
  });

  const handleDelete = (item: RecruitmentPost) => {
    Alert.alert(
      t("recruitmentPost.deleteTitle"),
      t("recruitmentPost.deleteMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => deletePost(item.documentId ?? item.id),
        },
      ],
    );
  };

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isPending } =
    useInfiniteQuery<StrapiListResponse<RecruitmentPost>>({
      queryKey: ["recruitment-posts", "mine", clubId],
      initialPageParam: 1,
      enabled: !!clubId,
      queryFn: async ({ pageParam = 1 }) => {
        const page =
          typeof pageParam === "number" ? pageParam : Number(pageParam);
        return recruitmentPostsApi.list({
          pagination: { page, pageSize: 20 },
          filters: { club: { documentId: { $eq: clubId } } } as any,
          populate: {
            club: true,
          },
        });
      },
      getNextPageParam: (lastPage) => {
        const p = lastPage.meta?.pagination;
        if (!p) return undefined;
        return p.page < p.pageCount ? p.page + 1 : undefined;
      },
    });

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  const onEndReached = () => {
    if (!isFetchingNextPage && hasNextPage) fetchNextPage();
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <Header title={t("profile.myPosts")} />
      {isPending ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <RecruitmentPostCard post={item} hideLogo>
              <CircleIconButton
                name="pencil"
                color="#3498db"
                onPress={() =>
                  router.push(
                    `/club/recruitment-posts/${item.documentId ?? item.id}/edit` as any,
                  )
                }
                style={styles.iconButton}
              />
              <CircleIconButton
                name="trash"
                color="#e74c3c"
                onPress={() => handleDelete(item)}
                style={styles.iconButton}
              />
            </RecruitmentPostCard>
          )}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <ThemedText>{t("recruitmentPost.noPosts")}</ThemedText>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const stylesheet = createStyle((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.background,
  },
  list: {
    padding: t.spacing.md,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: t.spacing.xl,
  },
  iconButton: {
    marginLeft: t.spacing.sm,
  },
}));
