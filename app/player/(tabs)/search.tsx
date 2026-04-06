import { recruitmentPostsApi } from "@/api/recruitment-posts";
import { FiltersSheet } from "@/components/FiltersSheet";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import {
  COACH_RECRUITMENT_POST_FILTERS,
  PLAYER_RECRUITMENT_POST_FILTERS,
} from "@/constants/recruitmentPostFilters";
import useGetCurrentUser from "@/features/auth/hooks/useGetCurrentUser";
import { RecruitmentPostCard } from "@/features/players/components/RecruitmentPostCard";
import { useDebounce } from "@/hooks/useDebounce";
import { createStyle, useStyle } from "@/theme";
import { RecruitmentPost } from "@/types/recruitment-posts";
import { StrapiListResponse } from "@/types/strapi";
import { Role } from "@/types/users";
import { buildStrapiFilters, toStrapiQueryString } from "@/utils/strapi-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlayerSearchScreen() {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 500);
  const styles = useStyle(stylesheet);

  const [filters, setFilters] = useState<Record<string, any>>({});
  const router = useRouter();
  const { data: me } = useGetCurrentUser();
  const recruitmentType =
    me?.role?.name === Role.Coach.toString() ? "coach" : "player";
  const activeFilters =
    recruitmentType === "coach"
      ? COACH_RECRUITMENT_POST_FILTERS
      : PLAYER_RECRUITMENT_POST_FILTERS;

  const onApplyFilters = (values: Record<string, any>) => {
    setFilters(values);
  };

  const strapiFilters = useMemo(
    () => buildStrapiFilters(filters, activeFilters),
    [filters, activeFilters],
  );

  const formattedFilters = useMemo(() => {
    return {
      $and: [
        { type: { $eq: recruitmentType } },
        ...(debouncedSearch
          ? [
              {
                $or: [
                  { title: { $containsi: debouncedSearch } },
                  { note: { $containsi: debouncedSearch } },
                  { position: { $containsi: debouncedSearch } },
                  { coachType: { $containsi: debouncedSearch } },
                  { club: { clubName: { $containsi: debouncedSearch } } },
                ],
              },
            ]
          : []),
        ...(Object.keys(strapiFilters).length ? [strapiFilters] : []),
      ],
    };
  }, [strapiFilters, debouncedSearch, recruitmentType]);

  const {
    data,
    error,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isPending,
    hasNextPage,
  } = useInfiniteQuery<StrapiListResponse<RecruitmentPost>>({
    queryKey: [
      "recruitment-posts",
      recruitmentType,
      debouncedSearch,
      toStrapiQueryString(strapiFilters),
    ],
    enabled: !!me?.role?.name,
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const page =
        typeof pageParam === "number" ? pageParam : Number(pageParam);
      return recruitmentPostsApi.list({
        pagination: { page, pageSize: 20 },
        populate: {
          club: {
            populate: {
              logo: true,
            },
          },
        },
        filters: formattedFilters,
      });
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.meta?.pagination;
      if (!pagination) return undefined;
      const { page, pageCount } = pagination;
      return page < pageCount ? page + 1 : undefined;
    },
  });

  const recruitmentPosts = data?.pages.flatMap((page) => page.data) ?? [];

  const onEndReached = () => {
    if (!isFetchingNextPage && hasNextPage) fetchNextPage();
  };

  console.log(error);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchRow}>
        <ThemedTextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder={t("search")}
          style={styles.input}
        />
        <FiltersSheet
          key={recruitmentType}
          filters={activeFilters}
          initialValues={filters}
          onApply={onApplyFilters}
        />
      </View>
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
        onRefresh={refetch}
        refreshing={isPending}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const stylesheet = createStyle((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.background,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 8,
    gap: 12,
  },
  input: {
    flex: 1,
    marginBottom: 0,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
}));
