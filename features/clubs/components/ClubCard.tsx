import { useStyleThemed } from "@/theme";
import { ClubProfile } from "@/types/clubs";
import { Image, Text, TouchableOpacity, View } from "react-native";

export type ClubCardProps = {
  club: ClubProfile;
  onPress?: () => void;
};

export function ClubCard({ club, onPress }: ClubCardProps) {
  const styles = useStyleThemed((t) => ({
    card: {
      backgroundColor: t.colors.surface,
      borderRadius: 14,
      padding: 14,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
      flexDirection: "row",
      alignItems: "center",
    },
    logo: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: "#eee",
      marginRight: 12,
    },
    infoContainer: { flex: 1 },
    name: { fontSize: 16, fontWeight: "600", color: t.colors.text },
    league: { fontSize: 13, color: t.colors.text, marginTop: 2 },
    location: { fontSize: 12, color: t.colors.text, marginTop: 2 },
    verified: {
      backgroundColor: t.colors.primary + "33", // 20% opacity
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      marginLeft: 8,
    },
    verifiedText: {
      fontSize: 11,
      fontWeight: "600",
      color: t.colors.primary,
    },
  }));

  const { clubName, country, city, league, level, logo, verified } = club;
  const logoUrl = logo?.data?.attributes?.url;
  const location = city ? `${city}, ${country}` : country;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.card}
    >
      <Image
        source={{
          uri:
            logoUrl ?? "https://ui-avatars.com/api/?name=Club&background=ddd",
        }}
        style={styles.logo}
      />

      <View style={styles.infoContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.name}>{clubName}</Text>
          {verified && (
            <View style={styles.verified}>
              <Text style={styles.verifiedText}>VERIFIED</Text>
            </View>
          )}
        </View>
        {league && (
          <Text style={styles.league}>
            {league} • {level.toUpperCase()}
          </Text>
        )}
        <Text style={styles.location}>📍 {location}</Text>
      </View>
    </TouchableOpacity>
  );
}
