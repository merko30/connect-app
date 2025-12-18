import { clubsApi } from "@/api/clubs";
import Welcome from "@/components/Welcome";
import useGetCurrentUser from "@/features/auth/hooks/useGetCurrentUser";
import { ClubCard } from "@/features/clubs/components/ClubCard";
import { createStyle, useStyle } from "@/theme";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Text, View } from "react-native";

export function PlayerHome() {
  const styles = useStyle(stylesheet);
  const { t } = useTranslation();
  const { data: me } = useGetCurrentUser();
  const { data, error } = useQuery({
    queryKey: ["clubs"],
    queryFn: () => clubsApi.list(),
  });
  const { data: clubs = [] } = data || {};

  console.log(data, error);

  return (
    <>
      <Welcome
        title={t("home.welcome", { user: `${me?.firstName} ${me?.lastName}` })}
        subtitle={t("home.findYourNextClub")}
        color="secondary"
      />
      <View style={styles.listContainer}>
        <Text style={styles.title}>{t("home.featuredClubs")}</Text>
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
