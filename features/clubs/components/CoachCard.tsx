import AvatarOrInitials from "@/components/AvatarOrInitials";
import { useStyleThemed } from "@/theme";
import { CoachProfile } from "@/types/coaches";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

type CoachCardProps = {
  coach: CoachProfile;
};

export function CoachCard({ coach }: CoachCardProps) {
  const { t } = useTranslation();
  const styles = useStyleThemed((theme) => ({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 14,
      padding: 14,
      shadowColor: "#999",
      shadowOpacity: 0.08,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 0.5,
      marginBottom: 12,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: "#eee",
      marginRight: 12,
    },
    infoContainer: { flex: 1 },
    name: { fontSize: 16, fontWeight: "600", color: theme.colors.text },
    subtitle: { fontSize: 13, color: theme.colors.text, marginTop: 2 },
    meta: { fontSize: 12, color: theme.colors.text, marginTop: 2 },
    status: {
      backgroundColor: theme.colors.secondary + "33",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    statusText: {
      fontSize: 11,
      fontWeight: "600",
      color: theme.colors.secondary,
    },
  }));

  const name = `${coach.firstName} ${coach.lastName}`;
  const imageUrl = coach.profilePhoto?.data?.attributes?.url;
  const coachType = coach.coachType
    ? t(`coachTypes.${coach.coachType}`)
    : t("coach");
  const experience = coach.experienceLevel
    ? t(`experienceLevels.${coach.experienceLevel}`)
    : null;
  const license = coach.licenseLevel
    ? t(`licenseLevels.${coach.licenseLevel}`)
    : null;

  return (
    <View style={styles.card}>
      <AvatarOrInitials
        avatarUrl={imageUrl}
        name={name}
        size={56}
        style={styles.avatar}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.subtitle}>
          {coachType}
          {experience ? ` • ${experience}` : ""}
        </Text>
        {!!coach.location && (
          <Text style={styles.meta}>📍 {coach.location}</Text>
        )}
        {!!coach.currentClub && (
          <Text style={styles.meta}>⚽ {coach.currentClub}</Text>
        )}
        {!!license && <Text style={styles.meta}>🎓 {license}</Text>}
      </View>

      {coach.isAvailable && (
        <View style={styles.status}>
          <Text style={styles.statusText}>{t("register.availableNow")}</Text>
        </View>
      )}
    </View>
  );
}
