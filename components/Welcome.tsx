import { createStyle, Theme, useStyle } from "@/theme";
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

  return (
    <GradientView color={color} style={styles.gradientContainer}>
      <View style={[styles.welcomeContainer, { paddingTop: insets.top + 20 }]}>
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
  welcomeText: {
    color: t.colors.background,
    fontWeight: "700",
  },
  subtitleText: {
    color: t.colors.background,
    fontWeight: "600",
  },
}));
