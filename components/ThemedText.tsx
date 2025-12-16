import { createStyle, useStyle } from "@/theme";
import React from "react";
import { StyleProp, Text, TextProps, TextStyle } from "react-native";

export type ThemedTextVariant =
  | "title"
  | "subtitle"
  | "body"
  | "caption"
  | "button";

const variantStyles = {
  title: {
    fontSize: 36,
    fontWeight: "bold" as TextStyle["fontWeight"],
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600" as TextStyle["fontWeight"],
    marginBottom: 2,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as TextStyle["fontWeight"],
  },
  caption: {
    fontSize: 14,
    color: "#888",
  },
  button: {
    fontSize: 16,
    fontWeight: "600" as TextStyle["fontWeight"],
    textTransform: "uppercase" as TextStyle["textTransform"],
  },
};

const stylesheet = createStyle((t) => ({
  base: {
    color: t.colors.text,
  },
}));

export interface ThemedTextProps extends TextProps {
  variant?: ThemedTextVariant;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  variant = "body",
  style,
  children,
  ...rest
}) => {
  const styles = useStyle(stylesheet);
  return (
    <Text style={[styles.base, variantStyles[variant], style]} {...rest}>
      {children}
    </Text>
  );
};
