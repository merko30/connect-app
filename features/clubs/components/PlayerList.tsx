import { playersApi } from "@/api/players";
import { PlayerCard } from "@/features/players/components/PlayerCard";
import { createStyle, useStyle } from "@/theme";
import { PlayerProfile } from "@/types/players";
import { StrapiListResponse } from "@/types/strapi";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { FlatList, Text } from "react-native";

type PlayerListProps = {
  search: string;
};

export function PlayerList({ search }: PlayerListProps) {
  const styles = useStyle(stylesheet);
  const { t } = useTranslation();
  const normalizedSearch = search.trim();

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isPending,
    hasNextPage,
  } = useInfiniteQuery<StrapiListResponse<PlayerProfile>>({
    queryKey: ["players", normalizedSearch],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const page =
        typeof pageParam === "number" ? pageParam : Number(pageParam);

      return playersApi.list({
        pagination: { page, pageSize: 20 },
        filters: normalizedSearch
          ? {
              $or: [
                { firstName: { $containsi: normalizedSearch } },
                { lastName: { $containsi: normalizedSearch } },
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

  return (
    <FlatList
      data={players}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <PlayerCard player={item} />}
      onRefresh={refetch}
      refreshing={isPending}
      onEndReached={() => {
        if (!isFetchingNextPage && hasNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.listContent,
        players.length === 0 && styles.emptyContent,
      ]}
      // ListHeaderComponent={
      //   <ThemedText variant="subtitle" style={styles.title}>
      //     {t("home.featuredPlayers")}
      //   </ThemedText>
      // }
      ListEmptyComponent={
        !isPending ? (
          <Text style={styles.emptyText}>{t("home.noPlayersFound")}</Text>
        ) : null
      }
    />
  );
}

const stylesheet = createStyle((t) => ({
  title: {
    fontWeight: "bold",
    marginBottom: t.spacing.sm,
  },
  listContent: {
    paddingBottom: 140,
  },
  emptyContent: {
    flexGrow: 1,
  },
  emptyText: {
    color: t.colors.text,
    opacity: 0.7,
    textAlign: "center",
    marginTop: t.spacing.xl,
  },
}));
