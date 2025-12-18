import { playersApi } from "@/api/players";
import KeyboardAvoid from "@/components/KeyboardAvoid";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import Welcome from "@/components/Welcome";
import useGetCurrentUser from "@/features/auth/hooks/useGetCurrentUser";
import { PlayerCard } from "@/features/players/components/PlayerCard";
import { useDebounce } from "@/hooks/useDebounce";
import { createStyle, useStyle } from "@/theme";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";

export function ClubHome() {
  const styles = useStyle(stylesheet);
  const [searchText, setSearchText] = React.useState("");
  const { t } = useTranslation();
  const { data: me } = useGetCurrentUser();
  const debouncedSearch = useDebounce(searchText, 500);
  const { data } = useQuery({
    queryKey: ["players", debouncedSearch],
    queryFn: () =>
      playersApi.list({
        filters: {
          $or: [
            {
              firstName: { $containsi: debouncedSearch },
            },
            {
              lastName: { $containsi: debouncedSearch },
            },
          ],
        },
      }),
  });
  const { data: players = [] } = data || {};

  return (
    <KeyboardAvoid>
      <Welcome
        title={t("home.welcome", { user: `${me?.firstName} ${me?.lastName}` })}
        subtitle={t("home.findAndRecruit")}
      >
        <ThemedTextInput
          placeholder={t("search")}
          value={searchText}
          onChangeText={setSearchText}
          style={styles.search}
        />
      </Welcome>
      <View style={styles.listContainer}>
        <ThemedText variant="subtitle" style={styles.title}>
          {t("home.featuredPlayers")}
        </ThemedText>
        <FlatList
          data={players}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(item) => <PlayerCard player={item.item} />}
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
