import { playersApi } from "@/api/players";
import { InfoBox } from "@/components/InfoBox";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { createStyle, useStyle } from "@/theme";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Linking, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlayerDetailsScreen() {
  const { t } = useTranslation();
  const styles = useStyle(stylesheet);
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["player", id],
    queryFn: () =>
      playersApi.get(id!, {
        populate: {
          user: { fields: ["phoneNumber", "id"] },
        },
      }),
    enabled: !!id,
  });
  const { data: player } = data ?? {};

  const age = player?.dateOfBirth
    ? new Date().getFullYear() - new Date(player.dateOfBirth).getFullYear()
    : null;

  const handleCallPlayer = () => {
    if (player?.user?.phoneNumber) {
      Linking.openURL(`tel:${player.user.phoneNumber}`);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ThemedText>{t("loading")}...</ThemedText>
      </View>
    );
  }

  if (error || !player) {
    return (
      <View style={styles.centerContainer}>
        <ThemedText>{t("errorOccurred")}</ThemedText>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScrollView style={styles.root}>
        <View style={styles.header}>
          <Pressable style={styles.closeBtn} onPress={() => router.back()}>
            <IconSymbol
              name="x.circle"
              size={24}
              color={styles.closeIcon.color}
            />
          </Pressable>
        </View>

        <View style={styles.container}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatarPlaceholder}>
              <IconSymbol
                name="person"
                size={40}
                color={styles.avatarIcon.color}
              />
            </View>
            {/* <View style={styles.starWrap}>
              <IconSymbol name="star" size={18} color={styles.star.color} />
            </View> */}
          </View>

          <ThemedText style={styles.name}>
            {player?.firstName} {player?.lastName}
          </ThemedText>
          <ThemedText style={styles.team}>{player?.currentClub}</ThemedText>

          <View style={styles.positionRow}>
            <View style={styles.positionBadge}>
              <ThemedText style={styles.positionShort}>
                {player?.primaryPosition}
              </ThemedText>
            </View>
            {player.secondaryPositions &&
              player.secondaryPositions !== player.primaryPosition && (
                <ThemedText style={styles.position}>
                  {player?.secondaryPositions}
                </ThemedText>
              )}
          </View>

          <View style={styles.infoRow}>
            <InfoBox
              label={t("register.age") || "Age"}
              value={age?.toString() || "N/A"}
            />
            <InfoBox
              label={t("register.height")}
              value={`${player?.heightCm}cm`}
            />
            <InfoBox
              label={t("register.weight")}
              value={`${player?.weightKg}kg`}
            />
            <InfoBox
              label={t("register.preferredFoot")}
              value={player?.preferredFoot?.charAt(0).toUpperCase() || "N/A"}
            />
          </View>

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <ThemedText style={styles.detailLabel}>
                {t("register.nationality")}
              </ThemedText>
              <ThemedText style={styles.detailValue}>
                {player?.nationality || "N/A"}
              </ThemedText>
            </View>
            <View style={styles.detailItem}>
              <ThemedText style={styles.detailLabel}>
                {t("register.experienceLevel")}
              </ThemedText>
              <ThemedText style={styles.detailValue}>
                {player?.experienceLevel
                  ? player.experienceLevel?.charAt(0).toUpperCase() +
                    player.experienceLevel?.slice(1)
                  : "N/A"}
              </ThemedText>
            </View>
          </View>

          {player?.availabilityFrom && (
            <View style={styles.infoSection}>
              <ThemedText style={styles.sectionLabel}>
                {t("register.availableFrom")}
              </ThemedText>
              <ThemedText style={styles.sectionValue}>
                {new Date(player.availabilityFrom).toLocaleDateString()}
              </ThemedText>
            </View>
          )}

          {player?.location && (
            <View style={styles.locationBox}>
              <IconSymbol
                name="location"
                size={16}
                color={styles.locationIcon.color}
              />
              <ThemedText style={styles.location}>{player.location}</ThemedText>
            </View>
          )}

          {player?.user?.phoneNumber && (
            <Pressable style={styles.contactBtn} onPress={handleCallPlayer}>
              <IconSymbol
                name="phone"
                size={18}
                color={styles.contactBtnText.color}
              />
              <ThemedText style={styles.contactBtnText}>
                {t("register.contactPhone")}
              </ThemedText>
            </Pressable>
          )}

          {player?.formerClubs && player.formerClubs.length > 0 && (
            <View style={styles.formerClubsSection}>
              <ThemedText style={styles.sectionTitle}>
                {t("register.formerClubs")}
              </ThemedText>
              {player.formerClubs.map(
                (club: { name: string }, index: number) => (
                  <View key={index} style={styles.clubItem}>
                    <View style={styles.clubDot} />
                    <ThemedText style={styles.clubName}>{club.name}</ThemedText>
                  </View>
                ),
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const stylesheet = createStyle((t) => ({
  root: {
    flex: 1,
    backgroundColor: t.colors.background,
  },
  header: {
    paddingHorizontal: t.spacing.lg,
    paddingVertical: t.spacing.sm,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  closeBtn: {
    padding: t.spacing.xs,
    borderRadius: t.radii.full,
  },
  closeIcon: {
    color: t.colors.gray[400],
  },
  container: {
    flex: 1,
    padding: t.spacing.lg,
    paddingBottom: t.spacing.xl,
    alignItems: "center",
  },
  avatarWrap: {
    position: "relative",
    marginBottom: t.spacing.md,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: t.radii.full,
    backgroundColor: t.colors.gray[200],
    justifyContent: "center",
    alignItems: "center",
  },
  avatarIcon: {
    color: t.colors.gray[500],
  },
  starWrap: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: t.colors.background,
    borderRadius: t.radii.full,
    padding: 3,
    shadowColor: t.colors.gray[900],
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  star: {
    color: t.colors.primary,
  },
  name: {
    fontWeight: "bold",
    fontSize: 20,
    color: t.colors.text,
    marginBottom: 4,
  },
  team: {
    color: t.colors.gray[500],
    fontSize: 14,
    marginBottom: 12,
  },
  positionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: t.spacing.lg,
  },
  positionBadge: {
    backgroundColor: t.colors.surface,
    borderRadius: t.radii.md,
    paddingHorizontal: t.spacing.xs,
    paddingVertical: 2,
    marginRight: t.spacing.xs,
  },
  positionShort: {
    fontWeight: "bold",
    fontSize: 12,
    color: t.colors.secondary,
  },
  position: {
    color: t.colors.gray[600],
    fontSize: 13,
  },
  infoRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: t.spacing.md,
  },
  detailsRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: t.spacing.md,
    paddingVertical: t.spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: t.colors.gray[200],
  },
  detailItem: {
    flex: 1,
    alignItems: "center",
  },
  detailLabel: {
    color: t.colors.gray[500],
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    color: t.colors.text,
    fontWeight: "600",
    fontSize: 14,
  },
  infoSection: {
    width: "100%",
    backgroundColor: t.colors.surface,
    borderRadius: t.radii.md,
    padding: t.spacing.md,
    marginVertical: t.spacing.sm,
    alignItems: "center",
  },
  sectionLabel: {
    color: t.colors.gray[500],
    fontSize: 12,
    marginBottom: 4,
  },
  sectionValue: {
    color: t.colors.text,
    fontWeight: "600",
    fontSize: 14,
  },
  locationBox: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: t.spacing.md,
    paddingHorizontal: t.spacing.md,
  },
  locationIcon: {
    color: t.colors.primary,
  },
  location: {
    color: t.colors.gray[600],
    fontSize: 13,
    marginLeft: t.spacing.xs,
  },
  contactBtn: {
    width: "100%",
    backgroundColor: t.colors.secondary,
    borderRadius: t.radii.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: t.spacing.md,
    marginTop: t.spacing.md,
    gap: t.spacing.xs,
  },
  contactBtnText: {
    color: t.colors.background,
    fontWeight: "bold",
    fontSize: 16,
  },
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
  centerContainer: {
    flex: 1,
    backgroundColor: t.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  safeAreaContainer: { flex: 1, backgroundColor: t.colors.background },
}));
