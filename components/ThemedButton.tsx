import React from "react";
import {
  ActivityIndicator,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { useStyleThemed } from "../theme";

export type ThemedButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "outlineSecondary";

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
    baseText: {
      fontWeight: "600",
      fontSize: 16,
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
    outlineSecondary: {
      backgroundColor: "transparent",
      borderWidth: 1.5,
      borderColor: t.colors.secondary,
    },
    textPrimary: {
      color: "#fff",
    },
    textSecondary: {
      color: "#fff",
    },
    textOutline: {
      color: t.colors.primary,
    },
    textOutlineSecondary: {
      color: t.colors.secondary,
    },
  }));

  const buttonStyle = [
    themed.base,
    variant === "primary" && themed.primary,
    variant === "secondary" && themed.secondary,
    variant === "outline" && themed.outline,
    variant === "outlineSecondary" && themed.outlineSecondary,
    style,
  ];
  const textStyles = [
    themed.baseText,
    variant === "primary" && themed.textPrimary,
    variant === "secondary" && themed.textSecondary,
    variant === "outline" && themed.textOutline,
    variant === "outlineSecondary" && themed.textOutlineSecondary,
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
