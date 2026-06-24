import AvatarOrInitials from "@/components/AvatarOrInitials";
import { useStyleThemed } from "@/theme";
import { RecruitmentPost } from "@/types/recruitment-posts";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  post: RecruitmentPost;
  children?: ReactNode;
  hideLogo?: boolean;
  isClub?: boolean;
  onPress?: () => void;
};

export function RecruitmentPostCard({
  post,
  children,
  hideLogo,
  isClub,
  onPress,
}: Props) {
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
    title: { fontSize: 16, fontWeight: "600", color: t.colors.text },
    metaLine: { fontSize: 13, color: t.colors.text, marginTop: 2 },
  }));

  const club = post.club;
  const clubName = club?.clubName ?? "-";
  const logoUrl = club?.logo?.url;
  const isCoachPost = post.type === "coach";

  const formatLabel = (value?: string | null) => {
    if (!value) return "-";

    return value
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };

  const coachTypeLabel = post.coachType
    ? t(`coachTypes.${post.coachType}`, {
        defaultValue: formatLabel(post.coachType),
      })
    : formatLabel(post.level);

  const primaryDetail = isCoachPost ? coachTypeLabel : (post.position ?? "-");

  const contractTypeLabel = post.contractType
    ? t(`contractTypes.${post.contractType}`, {
        defaultValue: formatLabel(post.contractType),
      })
    : "-";

  const shouldHideLogo = hideLogo || isClub;
  const metaLine = [
    !isClub ? clubName : null,
    primaryDetail !== "-" ? primaryDetail : null,
    contractTypeLabel !== "-" ? contractTypeLabel : null,
  ]
    .filter(Boolean)
    .join(" - ");

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      {!shouldHideLogo && (
        <AvatarOrInitials
          name={clubName}
          avatarUrl={logoUrl}
          style={styles.logo}
        />
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{post.title}</Text>
        <Text numberOfLines={1} style={styles.metaLine}>
          {metaLine}
        </Text>
      </View>
      {children}
    </TouchableOpacity>
  );
}
