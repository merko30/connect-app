import { useStyleThemed } from "@/theme";
import { RecruitmentPost } from "@/types/recruitment-posts";
import { useTranslation } from "react-i18next";
import { Image, Text, View } from "react-native";

type Props = {
  post: RecruitmentPost;
};

export function RecruitmentPostCard({ post }: Props) {
  const { t } = useTranslation();
  const styles = useStyleThemed((t) => ({
    card: {
      backgroundColor: t.colors.surface,
      borderRadius: 14,
      padding: 14,
      marginBottom: 12,
      shadowColor: "#888",
      shadowOpacity: 0.0005,
      shadowRadius: 40,
      shadowOffset: { width: 1, height: 4 },
      elevation: 1,
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 1,
    },
    logo: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: "#eee",
      marginRight: 12,
    },
    infoContainer: { flex: 1 },
    clubName: { fontSize: 16, fontWeight: "600", color: t.colors.text },
    position: { fontSize: 13, color: t.colors.text, marginTop: 2 },
    note: { fontSize: 12, color: t.colors.text, marginTop: 2 },
    league: { fontSize: 12, color: t.colors.text, marginTop: 2 },
  }));

  const club = post.club;
  const clubName = club?.clubName ?? "-";
  const logoUrl = club?.logo?.data?.attributes?.url;

  console.log(post.club);

  return (
    <View style={styles.card}>
      <Image
        source={{
          uri:
            logoUrl ??
            `https://ui-avatars.com/api/?name=${encodeURIComponent(clubName)}&background=ddd`,
        }}
        style={styles.logo}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.clubName}>{clubName}</Text>
        <Text style={styles.position}>{t(`positions.${post.position}`)}</Text>
        {club?.league && <Text style={styles.league}>{club.league}</Text>}
        {!!post.note && <Text style={styles.note}>{post.note}</Text>}
      </View>
    </View>
  );
}
