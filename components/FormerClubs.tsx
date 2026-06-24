import { createStyle, useStyle } from "@/theme";
import { PlayerProfile } from "@/types/players";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { ThemedText } from "./ThemedText";

const FormerClubs = ({
  formerClubs,
}: {
  formerClubs: PlayerProfile["formerClubs"];
}) => {
  const styles = useStyle(stylesheet);
  const { t } = useTranslation();

  return (
    <View style={styles.formerClubsSection}>
      <ThemedText style={styles.sectionTitle}>
        {t("register.formerClubs")}
      </ThemedText>
      <View style={styles.clubItem}>
        <ThemedText style={styles.clubName}>{t("club")}</ThemedText>
        <View style={styles.clubStats}>
          <ThemedText style={styles.clubStat}>
            {t("register.appearances")}
          </ThemedText>
          <ThemedText style={styles.clubStat}>
            {t("register.scoredGoals")}
          </ThemedText>
          <ThemedText style={styles.clubStat}>
            {t("register.assists")}
          </ThemedText>
        </View>
      </View>
      {formerClubs?.length ? (
        formerClubs?.map((club, index) => (
          <View key={index} style={styles.clubItem}>
            <ThemedText style={styles.clubName}>{club.name}</ThemedText>
            <View style={styles.clubStats}>
              <ThemedText style={styles.statValue}>
                {club.appearances ?? "N/A"}
              </ThemedText>
              <ThemedText style={styles.statValue}>
                {club.goals ?? "N/A"}
              </ThemedText>
              <ThemedText style={styles.statValue}>
                {club.assists ?? "N/A"}
              </ThemedText>
            </View>
          </View>
        ))
      ) : (
        <ThemedText style={styles.noClubsText} variant="body">
          {t("register.noFormerClubs")}
        </ThemedText>
      )}
    </View>
  );
};

const stylesheet = createStyle((t) => ({
  formerClubsSection: {
    width: "100%",
    marginTop: t.spacing.xl,
    paddingTop: t.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: t.colors.gray[200],
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: t.colors.text,
    marginBottom: t.spacing.md,
  },
  clubItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    width: "100%",
    marginBottom: t.spacing.md,
  },
  clubDot: {
    width: 8,
    height: 8,
    borderRadius: t.radii.full,
    backgroundColor: t.colors.primary,
    marginRight: t.spacing.md,
  },
  clubName: {
    color: t.colors.text,
    fontSize: 14,
  },
  clubStats: {
    flexDirection: "row",
    gap: t.spacing.sm,
  },
  clubStat: {
    color: t.colors.gray[600],
    fontSize: 12,
    textAlign: "center",
  },
  statValue: {
    color: t.colors.text,
    fontSize: 12,
    marginRight: 10,
  },
  noClubsText: {
    color: t.colors.gray[600],
    fontStyle: "italic",
    fontSize: 12,
    marginBottom: t.spacing.md,
  },
}));

export default FormerClubs;
