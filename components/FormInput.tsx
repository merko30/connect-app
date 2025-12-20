import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import React from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { TextInputProps, View, ViewStyle } from "react-native";

export type FormInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  placeholder: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  style?: ViewStyle;
  objectKey?: string;
};

export function FormInput<T extends FieldValues>({
  control,
  name,
  placeholder,
  style,
  keyboardType = "default",
  ...props
}: FormInputProps<T> & TextInputProps) {
  return (
    <View style={{ flex: 1 }}>
      {placeholder && (
        <ThemedText style={{ marginBottom: 1.5 }}>{placeholder}</ThemedText>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View style={style}>
            <ThemedTextInput
              value={value}
              onChangeText={onChange}
              keyboardType={keyboardType}
              {...props}
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
    </View>
  );
}
