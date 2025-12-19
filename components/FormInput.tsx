import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import React from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { View, ViewStyle } from "react-native";

export type FormInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  placeholder: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  style?: ViewStyle;
};

export function FormInput<T extends FieldValues>({
  control,
  name,
  placeholder,
  keyboardType = "default",
  style,
}: FormInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={style}>
          <ThemedTextInput
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
            keyboardType={keyboardType}
          />
          {error && (
            <ThemedText
              style={{ color: "#ff5252", fontSize: 12, marginBottom: 4 }}
            >
              {error.message}
            </ThemedText>
          )}
        </View>
      )}
    />
  );
}
