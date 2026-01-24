import { ThemedText } from "@/components/ThemedText";
import { createStyle, useStyle, useTheme } from "@/theme";
import Picker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Platform, Pressable, View } from "react-native";
import Modal from "react-native-modal";

export type FormDatePickerProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  style?: any;
  pickerContainerStyle?: any;
};

export function FormDatePicker<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Select...",
  pickerContainerStyle,
}: FormDatePickerProps<T>) {
  const styles = useStyle(stylesheet);
  const { t } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <View
            style={{
              marginBottom: 12,
            }}
          >
            {label && <ThemedText>{label}</ThemedText>}

            <Pressable
              style={[styles.pickerContainer, pickerContainerStyle]}
              onPress={() => setOpen(true)}
            >
              <ThemedText style={styles.picker}>
                {value ? value.toDateString() : placeholder}
              </ThemedText>
            </Pressable>

            <Modal isVisible={open} onDismiss={() => setOpen(false)}>
              <View
                style={{
                  height: "auto",
                  backgroundColor: t.colors.background,
                  borderRadius: 8,
                  padding: 10,
                  overflow: "hidden",
                }}
              >
                <Picker
                  value={value || new Date()}
                  onChange={(_, date) => {
                    onChange(date);
                    setOpen(false);
                  }}
                  accentColor={t.colors.accent}
                  mode="date"
                  display={Platform.OS === "ios" ? "inline" : "default"}
                />
              </View>
            </Modal>
            {error && (
              <ThemedText
                style={{ color: "#ff5252", fontSize: 12, marginBottom: 4 }}
              >
                {error.message}
              </ThemedText>
            )}
          </View>
        );
      }}
    />
  );
}

const stylesheet = createStyle((t) => ({
  pickerContainer: {
    borderWidth: 1,
    borderColor: t.colors.text + "33",
    borderRadius: 8,
    marginTop: 4,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: t.colors.surface,
  },
  picker: {
    width: "100%",
    color: t.colors.text,
  },
  label: { marginBottom: 1.5 },
  sheetButton: {
    backgroundColor: t.colors.surface,
    color: t.colors.text,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: t.colors.text + "33",
    marginBottom: 12,
  },
}));
