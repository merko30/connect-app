import { recruitmentPostsApi } from "@/api/recruitment-posts";
import KeyboardAvoid from "@/components/KeyboardAvoid";
import Search from "@/components/Search";
import { ThemedText } from "@/components/ThemedText";
import Welcome from "@/components/Welcome";
import useGetCurrentUser from "@/features/auth/hooks/useGetCurrentUser";
import { RecruitmentPostCard } from "@/features/players/components/RecruitmentPostCard";
import { useDebounce } from "@/hooks/useDebounce";
import { createStyle, useStyle } from "@/theme";
import { RecruitmentPost } from "@/types/recruitment-posts";
import { StrapiListResponse } from "@/types/strapi";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function PlayerHome() {
  const styles = useStyle(stylesheet);
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data: me } = useGetCurrentUser();
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 500);

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, error } =
    useInfiniteQuery<StrapiListResponse<RecruitmentPost>>({
      queryKey: ["recruitment-posts", debouncedSearch],
      initialPageParam: 1,
      queryFn: async ({ pageParam = 1 }) => {
        const page =
          typeof pageParam === "number" ? pageParam : Number(pageParam);

        return recruitmentPostsApi.list({
          pagination: { page, pageSize: 20 },
          populate: {
            club: true,
          },
          filters: debouncedSearch
            ? ({
                $or: [
                  { title: { $containsi: debouncedSearch } },
                  { note: { $containsi: debouncedSearch } },
                  { position: { $containsi: debouncedSearch } },
                  {
                    club: {
                      clubName: { $containsi: debouncedSearch },
                    },
                  },
                ],
              } as any)
            : undefined,
        });
      },
      getNextPageParam: (lastPage) => {
        const pagination = lastPage.meta?.pagination;
        if (!pagination) return undefined;

        const { page, pageCount } = pagination;
        return page < pageCount ? page + 1 : undefined;
      },
    });

  console.log(error);

  const recruitmentPosts = data?.pages.flatMap((page) => page.data) ?? [];

  // TODO: implement onEndReachedThreshold and onMomentumScrollBegin to avoid multiple calls
  const onEndReached = () => {
    if (!isFetchingNextPage && hasNextPage) fetchNextPage();
  };

  return (
    <KeyboardAvoid style={styles.container} keyboardVerticalOffset={insets.top}>
      <Welcome
        title={t("home.welcome", { user: `${me?.firstName} ${me?.lastName}` })}
        subtitle={t("home.findYourNextOpportunity")}
        color="secondary"
      >
        <Search value={searchText} onChangeText={setSearchText} />
      </Welcome>
      <View style={styles.listContainer}>
        <ThemedText style={styles.title}>
          {t("home.featuredRecruitmentPosts")}
        </ThemedText>
        <FlatList
          data={recruitmentPosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <RecruitmentPostCard
              post={item}
              onPress={() =>
                router.push(
                  `/player/recruitment-posts/${item.documentId ?? item.id}` as any,
                )
              }
            />
          )}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="never"
        />
      </View>
    </KeyboardAvoid>
  );
}

const stylesheet = createStyle((t) => ({
  container: {
    backgroundColor: t.colors.background,
    flex: 1,
  },
  listContainer: {
    paddingTop: t.spacing.xl,
    paddingHorizontal: t.spacing.lg,
    flex: 1.5,
  },
  title: {
    fontSize: t.spacing.lg,
    fontWeight: "bold",
    marginBottom: t.spacing.sm,
  },
}));
