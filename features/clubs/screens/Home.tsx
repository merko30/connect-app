import { playersApi } from "@/api/players";
import { ThemedText } from "@/components/ThemedText";
import Welcome from "@/components/Welcome";
import { PlayerCard } from "@/features/players/components/PlayerCard";
import { createStyle, useStyle } from "@/theme";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FlatList, View } from "react-native";

export function ClubHome() {
  const styles = useStyle(stylesheet);
  const { data } = useQuery({
    queryKey: ["players"],
    queryFn: () => playersApi.list(),
  });
  const { data: players = [] } = data || {};

  return (
    <>
      <Welcome title="Welcome, Amir" subtitle="Find and recruit new players" />
      <View style={styles.listContainer}>
        <ThemedText variant="subtitle" style={styles.title}>
          Find your new star
        </ThemedText>
        <FlatList
          data={players}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(item) => <PlayerCard player={item.item} />}
        />
      </View>
    </>
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
}));
