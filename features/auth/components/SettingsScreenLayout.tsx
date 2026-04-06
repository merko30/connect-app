import Header from "@/components/Header";
import { ThemedText } from "@/components/ThemedText";
import { createStyle, useStyle } from "@/theme";
import { PropsWithChildren } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SettingsScreenLayoutProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  headerTitle?: string;
}

export default function SettingsScreenLayout({
  title,
  subtitle,
  headerTitle,
  children,
}: SettingsScreenLayoutProps) {
  const styles = useStyle(stylesheet);

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <Header title={headerTitle ?? title} />

      <View style={styles.content}>
        <ThemedText variant="subtitle" style={styles.title}>
          {title}
        </ThemedText>

        {subtitle ? (
          <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
        ) : null}

        {children}
      </View>
    </SafeAreaView>
  );
}

const stylesheet = createStyle((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: t.spacing.lg,
    paddingTop: t.spacing.lg,
  },
  title: {
    marginBottom: t.spacing.sm,
    fontWeight: "700",
  },
  subtitle: {
    color: t.colors.gray[500],
    marginBottom: t.spacing.lg,
  },
}));
