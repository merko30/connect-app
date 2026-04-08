import useGetCurrentUser from "@/features/auth/hooks/useGetCurrentUser";
import { createStyle, Theme, useStyle } from "@/theme";
import { Role } from "@/types/users";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientView } from "./GradientView";
import { ThemedText } from "./ThemedText";

const Welcome = ({
  title,
  subtitle,
  children,
  color = "primary",
}: {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
  color?: keyof Theme["colors"];
}) => {
  const styles = useStyle(stylesheet);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { data: me } = useGetCurrentUser();

  const roleMeta =
    me?.role?.name === Role.ClubStaff
      ? {
          emoji: "🏟️",
          label: t("home.roleBadge.clubStaff"),
        }
      : me?.role?.name === Role.Coach
        ? {
            emoji: "📋",
            label: t("coach"),
          }
        : me?.role?.name === Role.Player
          ? {
              emoji: "⚽",
              label: t("player"),
            }
          : null;

  return (
    <GradientView color={color} style={styles.gradientContainer}>
      <View style={[styles.welcomeContainer, { paddingTop: insets.top + 20 }]}>
        {roleMeta && (
          <View style={styles.roleIntro}>
            <ThemedText style={styles.roleHint}>
              {t("home.roleBadge.signedInAs")}
            </ThemedText>
            <View style={styles.roleBadge}>
              <ThemedText style={styles.roleEmoji}>{roleMeta.emoji}</ThemedText>
              <ThemedText style={styles.roleLabel}>{roleMeta.label}</ThemedText>
            </View>
          </View>
        )}

        <ThemedText variant="title" style={styles.welcomeText}>
          {title}
        </ThemedText>
        <ThemedText variant="subtitle" style={styles.subtitleText}>
          {subtitle}
        </ThemedText>
      </View>
      {children}
    </GradientView>
  );
};

export default Welcome;

const stylesheet = createStyle((t) => ({
  gradientContainer: {
    flex: 0,
    paddingBottom: t.spacing.lg,
  },
  welcomeContainer: {
    paddingHorizontal: t.spacing.lg,
    justifyContent: "center",
  },
  roleIntro: {
    alignSelf: "flex-start",
    marginBottom: t.spacing.sm,
  },
  roleBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: t.spacing.xs,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: t.radii.full,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  roleEmoji: {
    fontSize: 16,
  },
  roleHint: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  roleLabel: {
    color: t.colors.background,
    fontWeight: "800",
  },
  welcomeText: {
    color: t.colors.background,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitleText: {
    color: t.colors.background,
    fontWeight: "600",
    opacity: 0.92,
    maxWidth: "92%",
  },
}));
