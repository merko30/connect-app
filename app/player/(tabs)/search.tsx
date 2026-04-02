import { clubsApi } from "@/api/clubs";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { CLUB_FILTERS } from "@/constants/clubFilters";
import { ClubCard } from "@/features/clubs/components/ClubCard";
import ClubFiltersSheet from "@/features/players/components/ClubFiltersSheet";
import { useDebounce } from "@/hooks/useDebounce";
import { createStyle, useStyle } from "@/theme";
import { ClubProfile } from "@/types/clubs";
import { StrapiListResponse } from "@/types/strapi";
import { buildStrapiFilters, toStrapiQueryString } from "@/utils/strapi-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlayerSearchScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 500);
  const styles = useStyle(stylesheet);

  const [filters, setFilters] = useState<Record<string, any>>({});

  const onApplyFilters = (values: Record<string, any>) => {
    setFilters(values);
  };

  const strapiFilters = useMemo(
    () => buildStrapiFilters(filters, CLUB_FILTERS),
    [filters],
  );

  const formattedFilters = useMemo(() => {
    return {
      $and: [
        ...(debouncedSearch
          ? [
              {
                $or: [{ clubName: { $containsi: debouncedSearch } }],
              },
            ]
          : []),
        ...(Object.keys(strapiFilters).length ? [strapiFilters] : []),
      ],
    };
  }, [strapiFilters, debouncedSearch]);

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isPending,
    hasNextPage,
    error,
  } = useInfiniteQuery<StrapiListResponse<ClubProfile>>({
    queryKey: ["clubs", debouncedSearch, toStrapiQueryString(strapiFilters)],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const page =
        typeof pageParam === "number" ? pageParam : Number(pageParam);
      return clubsApi.list({
        pagination: { page, pageSize: 20 },
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

  const clubs = data?.pages.flatMap((page) => page.data) ?? [];
  console.log(clubs, error);

  const onEndReached = () => {
    if (!isFetchingNextPage && hasNextPage) fetchNextPage();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchRow}>
        <ThemedTextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder={t("search")}
          style={styles.input}
        />
        <ClubFiltersSheet filters={CLUB_FILTERS} onApply={onApplyFilters} />
      </View>
      <FlatList
        data={clubs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ClubCard
            club={item}
            onPress={() =>
              router.push(`/player/club/${item.documentId ?? item.id}`)
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
