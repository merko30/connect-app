import { createStyle, Theme, useStyle } from "@/theme";
import { View } from "react-native";
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

  return (
    <GradientView color={color}>
      <View style={styles.welcomeContainer}>
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
  welcomeContainer: {
    paddingTop: 80,
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
