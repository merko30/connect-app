import { ThemedText } from "@/components/ThemedText";
import { createStyle, useStyle } from "@/theme";
import { PlayerProfile } from "@/types/players";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

// Dummy player data for now
const player: PlayerProfile = {
  documentId: "1",
  id: 1,
  firstName: "Jalen",
  lastName: "Johnson",
  dateOfBirth: "2002-05-15",
  nationality: "United States",
  location: "New York, NY",
  primaryPosition: "GK",
  secondaryPositions: null,
  preferredFoot: "right",
  heightCm: 188,
  weightKg: 82,
  currentClub: "Manchester United",
  isFreeAgent: false,
  experienceLevel: "pro",
  availabilityFrom: "2024-06-30",
  visibility: "public",
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z",
};

export default function PlayerDetailsScreen() {
  const styles = useStyle(stylesheet);
  const router = useRouter();

  const age = player.dateOfBirth
    ? new Date().getFullYear() - new Date(player.dateOfBirth).getFullYear()
    : null;

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons
                name="person"
                size={32}
                color={styles.avatarIcon.color}
              />
            </View>
            <View style={styles.starWrap}>
              <Ionicons name="star" size={16} color={styles.star.color} />
            </View>
          </View>
          <View style={styles.headerTextWrap}>
            <ThemedText style={styles.name} numberOfLines={1}>
              {player.firstName} {player.lastName}
            </ThemedText>
            <ThemedText style={styles.team}>{player.currentClub}</ThemedText>
            <View style={styles.positionRow}>
              <View style={styles.positionBadge}>
                <ThemedText style={styles.positionShort}>
                  {player.primaryPosition}
                </ThemedText>
              </View>
              {player.secondaryPositions && (
                <ThemedText style={styles.position}>
                  {player.secondaryPositions}
                </ThemedText>
              )}
            </View>
          </View>
          <Pressable style={styles.closeBtn} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={styles.closeIcon.color} />
          </Pressable>
        </View>

        <View style={styles.infoRow}>
          <InfoBox label="Age" value={age?.toString() || "N/A"} />
          <InfoBox label="Height" value={`${player.heightCm}cm`} />
          <InfoBox label="Weight" value={`${player.weightKg}kg`} />
          <InfoBox
            label="Foot"
            value={player.preferredFoot?.charAt(0).toUpperCase() || "N/A"}
          />
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>Nationality</ThemedText>
            <ThemedText style={styles.detailValue}>
              {player.nationality}
            </ThemedText>
          </View>
          <View style={styles.detailItem}>
            <ThemedText style={styles.detailLabel}>Experience</ThemedText>
            <ThemedText style={styles.detailValue}>
              {player.experienceLevel
                ? player.experienceLevel?.charAt(0).toUpperCase() +
                  player.experienceLevel?.slice(1)
                : "N/A"}
            </ThemedText>
          </View>
        </View>

        {player.availabilityFrom && (
          <View style={styles.availabilityBox}>
            <ThemedText style={styles.availabilityLabel}>
              Available From
            </ThemedText>
            <ThemedText style={styles.availabilityValue}>
              {new Date(player.availabilityFrom).toLocaleDateString()}
            </ThemedText>
          </View>
        )}

        {player.location && (
          <View style={styles.locationBox}>
            <Ionicons
              name="location"
              size={16}
              color={styles.locationIcon.color}
            />
            <ThemedText style={styles.location}>{player.location}</ThemedText>
          </View>
        )}

        <Pressable style={styles.contactBtn}>
          <ThemedText style={styles.contactBtnText}>Contact Player</ThemedText>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function InfoBox({ label, value }: { label: string; value: string | number }) {
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
    backgroundColor: t.colors.surface,
  },
  scrollContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: t.spacing.lg,
    flex: 1,
  },
  card: {
    backgroundColor: t.colors.background,
    borderRadius: t.radii.xl,
    padding: t.spacing.lg,
    width: "90%",
    maxWidth: 360,
    shadowColor: t.colors.gray[900],
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: t.spacing.md,
  },
  avatarWrap: {
    marginRight: t.spacing.md,
    position: "relative",
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
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
  headerTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
    color: t.colors.text,
    marginBottom: 2,
  },
  team: {
    color: t.colors.gray[500],
    fontSize: 13,
    marginBottom: 4,
  },
  positionRow: {
    flexDirection: "row",
    alignItems: "center",
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
    fontSize: 11,
    color: t.colors.secondary,
  },
  position: {
    color: t.colors.gray[600],
    fontSize: 12,
  },
  closeBtn: {
    marginLeft: t.spacing.md,
    padding: t.spacing.xs,
    borderRadius: t.radii.full,
  },
  closeIcon: {
    color: t.colors.gray[400],
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: t.spacing.md,
  },
  infoBox: {
    flex: 1,
    alignItems: "center",
    backgroundColor: t.colors.surface,
    borderRadius: t.radii.md,
    marginHorizontal: 2,
    paddingVertical: t.spacing.sm,
  },
  infoLabel: {
    color: t.colors.gray[500],
    fontSize: 11,
    marginBottom: 2,
  },
  infoValue: {
    color: t.colors.text,
    fontWeight: "bold",
    fontSize: 14,
  },
  detailsRow: {
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
  availabilityBox: {
    backgroundColor: t.colors.surface,
    borderRadius: t.radii.md,
    padding: t.spacing.md,
    marginVertical: t.spacing.sm,
    alignItems: "center",
  },
  availabilityLabel: {
    color: t.colors.gray[500],
    fontSize: 12,
    marginBottom: 4,
  },
  availabilityValue: {
    color: t.colors.text,
    fontWeight: "600",
    fontSize: 14,
  },
  locationBox: {
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
    backgroundColor: t.colors.secondary,
    borderRadius: t.radii.lg,
    alignItems: "center",
    paddingVertical: t.spacing.sm,
    marginTop: t.spacing.md,
  },
  contactBtnText: {
    color: t.colors.background,
    fontWeight: "bold",
    fontSize: 16,
  },
}));
