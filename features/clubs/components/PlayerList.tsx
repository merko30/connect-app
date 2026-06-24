import { playersApi } from "@/api/players";
import { PlayerCard } from "@/features/players/components/PlayerCard";
import { createStyle, useStyle } from "@/theme";
import { PlayerProfile } from "@/types/players";
import { StrapiListResponse } from "@/types/strapi";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { FlatList, Text } from "react-native";

type PlayerListProps = {
  search: string;
};

export function PlayerList({ search }: PlayerListProps) {
  const styles = useStyle(stylesheet);
  const { t } = useTranslation();
  const normalizedSearch = search.trim();

  const { data, refetch, isPending } = useQuery<
    StrapiListResponse<PlayerProfile>
  >({
    queryKey: ["players", "featured", normalizedSearch],
    queryFn: async () => {
      return playersApi.list({
        populate: ["profilePhoto"],
        // TODO: replace this with a dedicated featured filter once it's defined.
        pagination: { page: 1, pageSize: 10 },
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
  });

  const players = data?.data ?? [];

  return (
    <FlatList
      data={players}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <PlayerCard player={item} />}
      onRefresh={refetch}
      refreshing={isPending}
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
