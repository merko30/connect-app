import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { createStyle, useStyle } from "@/theme";
import { RecruitmentPost } from "@/types/recruitment-posts";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

type Props = {
  players?: RecruitmentPost["interestedPlayers"];
};

export function InterestedPlayersCard({ players = [] }: Props) {
  const { t } = useTranslation();
  const styles = useStyle(stylesheet);
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const count = players.length;

  const title = useMemo(
    () => `${t("recruitmentPost.interestedPlayers")} (${count})`,
    [count, t],
  );

  return (
    <View style={styles.card}>
      <Pressable
        style={styles.header}
        onPress={() => setExpanded((prev) => !prev)}
        android_ripple={{ color: "#00000010" }}
      >
        <ThemedText style={styles.title}>{title}</ThemedText>
        <IconSymbol
          name="chevron.right"
          size={18}
          color="#888"
          style={{ transform: [{ rotate: expanded ? "90deg" : "0deg" }] }}
        />
      </Pressable>

      {expanded ? (
        <View style={styles.content}>
          {count === 0 ? (
            <ThemedText style={styles.emptyText}>
              {t("recruitmentPost.noInterestedPlayers")}
            </ThemedText>
          ) : (
            players.map((player) => {
              const fullName =
                `${player.firstName ?? ""} ${player.lastName ?? ""}`.trim();
              const playerName = fullName || `${t("player")} #${player.id}`;
              const playerRouteId = player.documentId ?? player.id;

              return (
                <Pressable
                  key={player.id}
                  style={styles.playerRow}
                  onPress={() =>
                    router.push({
                      pathname: "/club/player/[id]",
                      params: { id: String(playerRouteId) },
                    })
                  }
                >
                  <ThemedText style={styles.playerName}>
                    {playerName}
                  </ThemedText>
                  {player.primaryPosition ? (
                    <ThemedText style={styles.playerPosition}>
                      {player.primaryPosition}
                    </ThemedText>
                  ) : null}
                </Pressable>
              );
            })
          )}
        </View>
      ) : null}
    </View>
  );
}

const stylesheet = createStyle((t) => ({
  card: {
    backgroundColor: t.colors.surface,
    borderRadius: 12,
    marginTop: -4,
    marginBottom: 12,
    marginHorizontal: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: t.colors.secondary,
  },
  content: {
    marginTop: 10,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: t.colors.secondary,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: t.colors.background,
  },
  playerName: {
    fontSize: 14,
    fontWeight: "500",
    color: t.colors.text,
    flex: 1,
  },
  playerPosition: {
    fontSize: 12,
    color: t.colors.secondary,
    marginLeft: t.spacing.sm,
  },
}));
