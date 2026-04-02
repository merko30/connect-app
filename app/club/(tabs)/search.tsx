import { playersApi } from "@/api/players";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { CLUB_FILTERS } from "@/constants/clubFilters";
import ClubFiltersSheet from "@/features/clubs/components/ClubFiltersSheet";
import { PlayerCard } from "@/features/players/components/PlayerCard";
import { useDebounce } from "@/hooks/useDebounce";
import { createStyle, useStyle } from "@/theme";
import { PlayerProfile } from "@/types/players";
import { StrapiListResponse } from "@/types/strapi";
import { buildStrapiFilters, toStrapiQueryString } from "@/utils/strapi-query";
import { useInfiniteQuery } from "@tanstack/react-query";
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
                $or: [
                  { firstName: { $containsi: debouncedSearch } },
                  { lastName: { $containsi: debouncedSearch } },
                ],
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
  } = useInfiniteQuery<StrapiListResponse<PlayerProfile>>({
    queryKey: ["players", debouncedSearch, toStrapiQueryString(strapiFilters)],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const page =
        typeof pageParam === "number" ? pageParam : Number(pageParam);
      return playersApi.list({
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

  const players = data?.pages.flatMap((page) => page.data) ?? [];

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
        data={players}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PlayerCard player={item} />}
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
    paddingHorizontal: t.spacing.md,
    paddingBottom: t.spacing.md,
    paddingTop: t.spacing.xs,
  },
}));
