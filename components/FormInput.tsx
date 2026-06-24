import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { TranslationKey } from "@/i18n";
import { createStyle, useStyle } from "@/theme";
import React from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  StyleProp,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

export type FormInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  placeholder: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  objectKey?: string;
};

export function FormInput<T extends FieldValues>({
  control,
  name,
  placeholder,
  style,
  containerStyle,
  ...props
}: FormInputProps<T> & TextInputProps) {
  const { t } = useTranslation();
  const styles = useStyle(stylesheet);

  return (
    <View style={[styles.container, containerStyle]}>
      {placeholder && (
        <ThemedText style={styles.label}>{placeholder}</ThemedText>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return (
            <View>
              <ThemedTextInput
                value={
                  typeof value === "number" ? value.toString() : (value ?? "")
                }
                onChangeText={onChange}
                style={style}
                {...props}
              />
              {error && (
                <ThemedText style={styles.error}>
                  {t(error.message as TranslationKey) ?? error.message}
                </ThemedText>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const stylesheet = createStyle((t) => ({
  container: { marginBottom: 4 },
  label: { marginBottom: 0 },
  error: {
    color: "#ff5252",
    fontWeight: "500",
    fontSize: 12,
    marginBottom: 4,
  },
}));
