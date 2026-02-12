import { ThemedText } from "@/components/ThemedText";
import { TranslationKey } from "@/i18n";
import { createStyle, useStyle } from "@/theme";
import React from "react";
import { useTranslation } from "react-i18next";

type FormErrorProps = {
  message?: string | null;
};

export function FormError({ message }: FormErrorProps) {
  const styles = useStyle(stylesheet);
  const { t } = useTranslation();

  if (!message) return null;

  const displayMessage = t(message as TranslationKey) ?? message;

  return <ThemedText style={styles.error}>{displayMessage}</ThemedText>;
}

const stylesheet = createStyle(() => ({
  error: {
    color: "#ff5252",
    fontSize: 12,
    marginBottom: 4,
  },
}));
