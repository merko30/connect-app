import React from "react";
import {
  ActivityIndicator,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { useStyleThemed } from "../theme";

export type ThemedButtonVariant = "primary" | "secondary" | "outline";

export interface ThemedButtonProps {
  title: string;
  onPress: () => void;
  variant?: ThemedButtonVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  style,
  textStyle,
  disabled,
  loading,
}) => {
  const themed = useStyleThemed((t) => ({
    base: {
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
      flexDirection: "row",
      opacity: disabled ? 0.6 : 1,
    },
    primary: {
      backgroundColor: t.colors.primary,
    },
    secondary: {
      backgroundColor: t.colors.secondary,
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 1.5,
      borderColor: t.colors.primary,
    },
    textPrimary: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 16,
    },
    textSecondary: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 16,
    },
    textOutline: {
      color: t.colors.primary,
      fontWeight: "600",
      fontSize: 16,
    },
  }));

  const buttonStyle = [
    themed.base,
    variant === "primary" && themed.primary,
    variant === "secondary" && themed.secondary,
    variant === "outline" && themed.outline,
    style,
  ];
  const textStyles = [
    variant === "primary" && themed.textPrimary,
    variant === "secondary" && themed.textSecondary,
    variant === "outline" && themed.textOutline,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading && (
        <ActivityIndicator
          color={variant === "outline" ? themed.textOutline.color : "#fff"}
          style={{ marginRight: 8 }}
        />
      )}
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  );
};
