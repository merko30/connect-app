import Logo from "@/assets/images/logo.svg";
import { ThemedText } from "@/components/ThemedText";
import { useStyleThemed } from "@/theme";
import React from "react";
import { View } from "react-native";

interface AuthHeaderProps {
  title: string;
  caption?: string;
  iconSize?: number;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  caption,
  iconSize = 56,
}) => {
  const styles = useStyleThemed((t) => ({
    container: {
      alignItems: "flex-start",
      marginBottom: 24,
    },
    icon: {
      marginBottom: t.spacing.lg,
    },
    title: {
      fontWeight: "bold",
      fontSize: 28,
      color: t.colors.secondary,
      marginBottom: t.spacing.xs,
    },
    caption: {
      color: t.colors.text,
    },
  }));

  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Logo width={iconSize} height={iconSize} />
      </View>
      <ThemedText variant="title" style={styles.title}>
        {title}
      </ThemedText>
      {!!caption && (
        <ThemedText variant="caption" style={styles.caption}>
          {caption}
        </ThemedText>
      )}
    </View>
  );
};
