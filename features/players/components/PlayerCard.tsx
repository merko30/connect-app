import { useStyleThemed } from "@/theme";
import { PlayerProfile } from "@/types/players";
import { Link } from "expo-router";
import { Image, Text, View } from "react-native";

type Props = {
  player: PlayerProfile;
  onPress?: () => void;
};

export function PlayerCard({ player, onPress }: Props) {
  const styles = useStyleThemed((t) => ({
    card: {
      backgroundColor: t.colors.surface,
      borderRadius: 14,
      padding: 14,
      marginBottom: 12,
      shadowColor: "#999",
      shadowOpacity: 0.08,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 0.5,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: "#eee",
      marginRight: 12,
    },
    infoContainer: { flex: 1 },
    name: { fontSize: 16, fontWeight: "600", color: t.colors.text },
    position: { fontSize: 13, color: t.colors.text, marginTop: 2 },
    location: { fontSize: 12, color: t.colors.text, marginTop: 2 },
    status: {
      backgroundColor: t.colors.secondary + "33", // 20% opacity
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    statusText: {
      fontSize: 11,
      fontWeight: "600",
      color: t.colors.secondary,
    },
  }));

  const name = `${player.firstName} ${player.lastName}`;
  const position = player.primaryPosition;
  const experience = player.experienceLevel;
  const location = player.location;
  const isFreeAgent = player.isFreeAgent;
  const imageUrl = player.profileImage?.data?.attributes.url;

  return (
    <Link
      href={{
        pathname: "/club/player/[id]",
        params: {
          id: player.documentId,
        },
      }}
      style={styles.card}
    >
      <Image
        source={{
          uri:
            imageUrl ??
            `https://ui-avatars.com/api/?name=${name}&background=ddd`,
        }}
        style={styles.avatar}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.position}>
          {position}
          {experience ? ` • ${experience}` : ""}
        </Text>
        {location && <Text style={styles.location}>📍 {location}</Text>}
      </View>

      {isFreeAgent && (
        <View style={styles.status}>
          <Text style={styles.statusText}>FREE</Text>
        </View>
      )}
    </Link>
  );
}
