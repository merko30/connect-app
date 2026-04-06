import { ThemedText } from "@/components/ThemedText";
import { createStyle, useStyle } from "@/theme";
import { PropsWithChildren } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

interface SettingsSectionCardProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
}

export default function SettingsSectionCard({
  title,
  subtitle,
  style,
  children,
}: SettingsSectionCardProps) {
  const styles = useStyle(stylesheet);

  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <ThemedText variant="subtitle" style={styles.title}>
          {title}
        </ThemedText>

        {subtitle ? (
          <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
        ) : null}
      </View>

      {children}
    </View>
  );
}

const stylesheet = createStyle((t) => ({
  card: {
    backgroundColor: t.colors.surface,
    padding: t.spacing.md,
    borderRadius: t.radii.md,
    gap: t.spacing.sm,
  },
  header: {
    gap: t.spacing.xs,
  },
  title: {
    fontWeight: "700",
  },
  subtitle: {
    color: t.colors.gray[500],
  },
}));
