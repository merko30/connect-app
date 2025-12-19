import { ThemedText } from "@/components/ThemedText";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { StyleSheet, View } from "react-native";

export type FormPickerProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  style?: any;
  pickerContainerStyle?: any;
};

export function FormPicker<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Select...",
  style,
  pickerContainerStyle,
}: FormPickerProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={{ marginBottom: 12 }}>
          {label && <ThemedText>{label}</ThemedText>}
          <View style={[styles.pickerContainer, pickerContainerStyle]}>
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              style={[styles.picker, style]}
              itemStyle={{ height: 50 }}
            >
              <Picker.Item label={placeholder} value="" />
              {options.map((opt) => (
                <Picker.Item
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                />
              ))}
            </Picker>
          </View>
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

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 4,
  },
  picker: {
    height: 50,
    width: "100%",
  },
});
