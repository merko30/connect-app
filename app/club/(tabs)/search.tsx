import { coachesApi } from "@/api/coaches";
import { playersApi } from "@/api/players";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { COACH_FILTERS } from "@/constants/coachFilters";
import { PLAYER_FILTERS } from "@/constants/playerFilters";
import { CoachCard } from "@/features/clubs/components/CoachCard";
import PlayerFiltersSheet from "@/features/clubs/components/PlayerFiltersSheet";
import { PlayerCard } from "@/features/players/components/PlayerCard";
import { useDebounce } from "@/hooks/useDebounce";
import { createStyle, useStyle } from "@/theme";
import { CoachProfile } from "@/types/coaches";
import { PlayerProfile } from "@/types/players";
import { StrapiListResponse } from "@/types/strapi";
import { buildStrapiFilters, toStrapiQueryString } from "@/utils/strapi-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SearchMode = "players" | "coaches";

export default function PlayerSearchScreen() {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 500);
  const styles = useStyle(stylesheet);

  const [mode, setMode] = useState<SearchMode>("players");
  const [filters, setFilters] = useState<Record<string, any>>({});

  useEffect(() => {
    setFilters({});
  }, [mode]);

  const activeFilters = useMemo(
    () => (mode === "players" ? PLAYER_FILTERS : COACH_FILTERS),
    [mode],
  );

  const onApplyFilters = (values: Record<string, any>) => {
    setFilters({ ...values });
  };

  const strapiFilters = useMemo(
    () => buildStrapiFilters(filters, activeFilters),
    [filters, activeFilters],
  );

  const formattedPlayerFilters = useMemo(() => {
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

  const formattedCoachFilters = useMemo(() => {
    return {
      $and: [
        { visibility: { $ne: "private" } },
        ...(debouncedSearch
          ? [
              {
                $or: [
                  { firstName: { $containsi: debouncedSearch } },
                  { lastName: { $containsi: debouncedSearch } },
                  { location: { $containsi: debouncedSearch } },
                ],
              },
            ]
          : []),
        ...(Object.keys(strapiFilters).length ? [strapiFilters] : []),
      ],
    };
  }, [strapiFilters, debouncedSearch]);

  const playerQuery = useInfiniteQuery<StrapiListResponse<PlayerProfile>>({
    queryKey: [
      "players",
      debouncedSearch,
      toStrapiQueryString(formattedPlayerFilters as any),
    ],
    enabled: mode === "players",
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const page =
        typeof pageParam === "number" ? pageParam : Number(pageParam);
      return playersApi.list({
        pagination: { page, pageSize: 20 },
        filters: formattedPlayerFilters,
      });
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.meta?.pagination;
      if (!pagination) return undefined;
      const { page, pageCount } = pagination;
      return page < pageCount ? page + 1 : undefined;
    },
  });

  const coachQuery = useInfiniteQuery<StrapiListResponse<CoachProfile>>({
    queryKey: [
      "coaches",
      debouncedSearch,
      toStrapiQueryString(formattedCoachFilters as any),
    ],
    enabled: mode === "coaches",
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const page =
        typeof pageParam === "number" ? pageParam : Number(pageParam);
      return coachesApi.list({
        pagination: { page, pageSize: 20 },
        filters: formattedCoachFilters,
      });
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.meta?.pagination;
      if (!pagination) return undefined;
      const { page, pageCount } = pagination;
      return page < pageCount ? page + 1 : undefined;
    },
  });

  const players = playerQuery.data?.pages.flatMap((page) => page.data) ?? [];
  const coaches = coachQuery.data?.pages.flatMap((page) => page.data) ?? [];

  const onEndReached = () => {
    if (mode === "players") {
      if (!playerQuery.isFetchingNextPage && playerQuery.hasNextPage) {
        playerQuery.fetchNextPage();
      }
      return;
    }

    if (!coachQuery.isFetchingNextPage && coachQuery.hasNextPage) {
      coachQuery.fetchNextPage();
    }
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
        <PlayerFiltersSheet
          key={mode}
          filters={activeFilters}
          initialValues={filters}
          onApply={onApplyFilters}
        />
      </View>

      <View style={styles.modeRow}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            mode === "players" && styles.modeButtonActive,
          ]}
          onPress={() => setMode("players")}
          activeOpacity={0.85}
        >
          <Text
            style={[
              styles.modeText,
              mode === "players" && styles.modeTextActive,
            ]}
          >
            {t("players")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeButton,
            mode === "coaches" && styles.modeButtonActive,
          ]}
          onPress={() => setMode("coaches")}
          activeOpacity={0.85}
        >
          <Text
            style={[
              styles.modeText,
              mode === "coaches" && styles.modeTextActive,
            ]}
          >
            {t("coaches")}
          </Text>
        </TouchableOpacity>
      </View>

      {mode === "players" ? (
        <FlatList
          data={players}
          key="players"
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PlayerCard player={item} />}
          onRefresh={playerQuery.refetch}
          refreshing={playerQuery.isPending}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <FlatList
          data={coaches}
          key="coaches"
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CoachCard coach={item} />}
          onRefresh={coachQuery.refetch}
          refreshing={coachQuery.isPending}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.listContent}
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
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  modeRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 12,
    marginBottom: 8,
    gap: 8,
  },
  modeButton: {
    flex: 1,
    backgroundColor: t.colors.surface,
    borderRadius: t.radii.full,
    paddingVertical: t.spacing.xs,
    alignItems: "center",
    borderWidth: 1,
    borderColor: t.colors.text + "14",
  },
  modeButtonActive: {
    backgroundColor: t.colors.secondary,
    borderColor: t.colors.secondary,
  },
  modeText: {
    color: t.colors.text,
    fontWeight: "600",
  },
  modeTextActive: {
    color: "#fff",
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
