import { playersApi } from "@/api/players";
import KeyboardAvoid from "@/components/KeyboardAvoid";
import Search from "@/components/Search";
import { ThemedText } from "@/components/ThemedText";
import Welcome from "@/components/Welcome";
import useGetCurrentUser from "@/features/auth/hooks/useGetCurrentUser";
import { PlayerCard } from "@/features/players/components/PlayerCard";
import { useDebounce } from "@/hooks/useDebounce";
import { createStyle, useStyle } from "@/theme";
import { PlayerProfile } from "@/types/players";
import { StrapiListResponse } from "@/types/strapi";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";

export function ClubHome() {
  const styles = useStyle(stylesheet);
  const { t } = useTranslation();
  const { data: me } = useGetCurrentUser();
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 500);

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isPending,
    hasNextPage,
  } = useInfiniteQuery<StrapiListResponse<PlayerProfile>>({
    queryKey: ["players", debouncedSearch],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const page =
        typeof pageParam === "number" ? pageParam : Number(pageParam);

      return playersApi.list({
        pagination: { page, pageSize: 20 },
        filters: debouncedSearch
          ? {
              $or: [
                { firstName: { $containsi: debouncedSearch } },
                { lastName: { $containsi: debouncedSearch } },
              ],
            }
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

  const players = data?.pages.flatMap((page) => page.data) ?? [];

  const onEndReached = () => {
    if (!isFetchingNextPage && hasNextPage) fetchNextPage();
  };

  return (
    <KeyboardAvoid>
      <Welcome
        title={t("home.welcome", { user: `${me?.firstName} ${me?.lastName}` })}
        subtitle={t("home.findAndRecruit")}
      >
        <Search value={searchText} onChangeText={setSearchText} />
      </Welcome>

      <View style={styles.listContainer}>
        <ThemedText variant="subtitle" style={styles.title}>
          {t("home.featuredPlayers")}
        </ThemedText>

        <FlatList
          data={players}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PlayerCard player={item} />}
          onRefresh={refetch}
          refreshing={isPending}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
        />
      </View>
    </KeyboardAvoid>
  );
}

const stylesheet = createStyle((t) => ({
  listContainer: {
    paddingTop: t.spacing.md,
    paddingHorizontal: t.spacing.md,
    flex: 1.5,
  },
  title: {
    fontWeight: "bold",
    marginBottom: t.spacing.sm,
  },
  search: {
    marginHorizontal: t.spacing.lg,
    marginVertical: t.spacing.xl,
    borderRadius: t.radii.full,
    paddingVertical: t.spacing.md,
    paddingHorizontal: t.spacing.lg,
    borderColor: "transparent",
  },
}));
