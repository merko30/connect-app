import { clubsApi } from "@/api/clubs";
import Welcome from "@/components/Welcome";
import { ClubCard } from "@/features/clubs/components/ClubCard";
import { createStyle, useStyle } from "@/theme";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FlatList, Text, View } from "react-native";

export function PlayerHome() {
  const styles = useStyle(stylesheet);
  const { data, error } = useQuery({
    queryKey: ["clubs"],
    queryFn: () => clubsApi.list(),
  });
  const { data: clubs = [] } = data || {};

  console.log(data, error);

  return (
    <>
      <Welcome
        title="Welcome, Merim"
        subtitle="Find your next club"
        color="secondary"
      />
      <View style={styles.listContainer}>
        <Text style={styles.title}>Find your new club</Text>
        <FlatList
          data={clubs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(item) => <ClubCard club={item.item} />}
        />
      </View>
    </>
  );
}

const stylesheet = createStyle((t) => ({
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
