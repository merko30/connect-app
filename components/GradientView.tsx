import { Theme, useTheme } from "@/theme";
import { lightenColor } from "@/utils/colors";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { StyleSheet } from "react-native";

type GradientViewProps = {
  children: ReactNode;
  color?: keyof Theme["colors"];
  style?: any;
};

export function GradientView({
  children,
  color = "primary",
  style,
}: GradientViewProps) {
  const { t } = useTheme();
  const gradientColor = t.colors[color] ?? t.colors.primary;
  const lighterColor = lightenColor(gradientColor, 15); // 30% lighter

  return (
    <LinearGradient
      colors={[gradientColor, lighterColor]}
      end={{ x: 1, y: 0 }}
      start={{ x: 1, y: 1 }}
      style={[styles.container, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
