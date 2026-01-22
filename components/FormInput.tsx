import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { TranslationKey } from "@/i18n";
import React from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TextInputProps, View, ViewStyle } from "react-native";

export type FormInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  placeholder: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  style?: ViewStyle;
  containerStyle?: ViewStyle;
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
  return (
    <View style={[{ marginBottom: 8 }, containerStyle]}>
      {placeholder && (
        <ThemedText style={{ marginBottom: 1.5 }}>{placeholder}</ThemedText>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          console.log(error);

          return (
            <View style={style}>
              <ThemedTextInput
                value={value}
                onChangeText={onChange}
                {...props}
              />
              {error && (
                <ThemedText
                  style={{
                    color: "#ff5252",
                    fontWeight: "500",
                    fontSize: 12,
                    marginBottom: 4,
                  }}
                >
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
