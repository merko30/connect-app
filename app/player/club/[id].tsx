import { clubsApi } from "@/api/clubs";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { createStyle, useStyle } from "@/theme";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Image, Linking, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ClubDetailsScreen() {
  const { t } = useTranslation();
  const styles = useStyle(stylesheet);
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["club", id],
    queryFn: () =>
      clubsApi.get(id!, {
        populate: { logo: true },
      }),
    enabled: !!id,
  });

  const club = data?.data;
  const logoUrl = club?.logo?.data?.attributes?.url;
  const location = club?.city ? `${club.city}, ${club.country}` : club?.country;

  const handleOpenWebsite = () => {
    if (club?.website) Linking.openURL(club.website);
  };

  const handleEmail = () => {
    if (club?.contactEmail) Linking.openURL(`mailto:${club.contactEmail}`);
  };

  const handlePhone = () => {
    if (club?.contactPhone) Linking.openURL(`tel:${club.contactPhone}`);
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ThemedText>{t("loading")}...</ThemedText>
      </View>
    );
  }

  if (error || !club) {
    return (
      <View style={styles.centerContainer}>
        <ThemedText>{t("errorOccurred")}</ThemedText>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScrollView style={styles.root}>
        {/* Header */}
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
          {/* Logo */}
          <View style={styles.logoWrap}>
            <Image
              source={{
                uri:
                  logoUrl ??
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(club.clubName)}&background=ddd`,
              }}
              style={styles.logo}
            />
            {club.verified && (
              <View style={styles.verifiedBadge}>
                <IconSymbol
                  name="checkmark.circle.fill"
                  size={16}
                  color={styles.verifiedIcon.color}
                />
              </View>
            )}
          </View>

          <ThemedText style={styles.name}>{club.clubName}</ThemedText>

          {club.verified && (
            <View style={styles.verifiedRow}>
              <ThemedText style={styles.verifiedText}>
                {t("register.verified")}
              </ThemedText>
            </View>
          )}

          {/* League & Level */}
          {club.league && (
            <View style={styles.leagueRow}>
              <View style={styles.leagueBadge}>
                <ThemedText style={styles.leagueText}>{club.league}</ThemedText>
              </View>
              <View style={styles.levelBadge}>
                <ThemedText style={styles.levelText}>
                  {club.level.toUpperCase()}
                </ThemedText>
              </View>
            </View>
          )}

          {/* Location */}
          {location && (
            <View style={styles.locationBox}>
              <IconSymbol
                name="location"
                size={16}
                color={styles.locationIcon.color}
              />
              <ThemedText style={styles.location}>{location}</ThemedText>
            </View>
          )}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Info Grid */}
          <View style={styles.infoRow}>
            <InfoBox label={t("register.country")} value={club.country} />
            {club.city && (
              <InfoBox label={t("register.city")} value={club.city} />
            )}
            <InfoBox
              label={t("register.level")}
              value={club.level.charAt(0).toUpperCase() + club.level.slice(1)}
            />
          </View>

          {/* Contact Actions */}
          {club.contactPhone && (
            <Pressable style={styles.contactBtn} onPress={handlePhone}>
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

          {club.contactEmail && (
            <Pressable
              style={[styles.contactBtn, styles.contactBtnSecondary]}
              onPress={handleEmail}
            >
              <IconSymbol
                name="envelope"
                size={18}
                color={styles.contactBtnSecondaryText.color}
              />
              <ThemedText style={styles.contactBtnSecondaryText}>
                {t("register.contactEmail")}
              </ThemedText>
            </Pressable>
          )}

          {club.website && (
            <Pressable
              style={[styles.contactBtn, styles.contactBtnSecondary]}
              onPress={handleOpenWebsite}
            >
              <IconSymbol
                name="globe"
                size={18}
                color={styles.contactBtnSecondaryText.color}
              />
              <ThemedText style={styles.contactBtnSecondaryText}>
                {t("register.website")}
              </ThemedText>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  const styles = useStyle(stylesheet);
  return (
    <View style={styles.infoBox}>
      <ThemedText style={styles.infoLabel}>{label}</ThemedText>
      <ThemedText style={styles.infoValue}>{value}</ThemedText>
    </View>
  );
}

const stylesheet = createStyle((t) => ({
  root: {
    flex: 1,
    backgroundColor: t.colors.background,
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: t.colors.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: t.colors.background,
    justifyContent: "center",
    alignItems: "center",
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
  logoWrap: {
    position: "relative",
    marginBottom: t.spacing.md,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: t.radii.full,
    backgroundColor: t.colors.gray[200],
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: -2,
    backgroundColor: t.colors.background,
    borderRadius: t.radii.full,
    padding: 2,
    shadowColor: t.colors.gray[900],
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  verifiedIcon: {
    color: t.colors.primary,
  },
  name: {
    fontWeight: "bold",
    fontSize: 22,
    color: t.colors.text,
    marginBottom: 6,
    textAlign: "center",
  },
  verifiedRow: {
    backgroundColor: t.colors.primary + "22",
    paddingHorizontal: t.spacing.sm,
    paddingVertical: 3,
    borderRadius: t.radii.md,
    marginBottom: t.spacing.sm,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: "600",
    color: t.colors.primary,
  },
  leagueRow: {
    flexDirection: "row",
    gap: t.spacing.xs,
    marginBottom: t.spacing.sm,
  },
  leagueBadge: {
    backgroundColor: t.colors.surface,
    borderRadius: t.radii.md,
    paddingHorizontal: t.spacing.sm,
    paddingVertical: 3,
  },
  leagueText: {
    fontSize: 13,
    color: t.colors.text,
    fontWeight: "500",
  },
  levelBadge: {
    backgroundColor: t.colors.surface,
    borderRadius: t.radii.md,
    paddingHorizontal: t.spacing.sm,
    paddingVertical: 3,
  },
  levelText: {
    fontSize: 13,
    color: t.colors.secondary,
    fontWeight: "600",
  },
  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: t.spacing.sm,
  },
  locationIcon: {
    color: t.colors.primary,
  },
  location: {
    color: t.colors.gray[600],
    fontSize: 13,
    marginLeft: t.spacing.xs,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: t.colors.gray[200],
    marginVertical: t.spacing.md,
  },
  infoRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: t.spacing.lg,
  },
  infoBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: t.colors.surface,
    borderRadius: t.radii.md,
    marginHorizontal: 2,
    paddingVertical: t.spacing.sm,
  },
  infoLabel: {
    color: t.colors.gray[500],
    textAlign: "center",
    fontSize: 11,
    marginBottom: 2,
  },
  infoValue: {
    color: t.colors.text,
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  contactBtn: {
    width: "100%",
    backgroundColor: t.colors.secondary,
    borderRadius: t.radii.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: t.spacing.md,
    marginTop: t.spacing.sm,
    gap: t.spacing.xs,
  },
  contactBtnText: {
    color: t.colors.background,
    fontWeight: "bold",
    fontSize: 16,
  },
  contactBtnSecondary: {
    backgroundColor: t.colors.surface,
  },
  contactBtnSecondaryText: {
    color: t.colors.text,
    fontWeight: "bold",
    fontSize: 16,
  },
}));
