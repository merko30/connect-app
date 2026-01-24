import { ThemedText } from "@/components/ThemedText";
import { createStyle, useStyle, useTheme } from "@/theme";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  useController,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActionSheetIOS, Platform, Pressable, View } from "react-native";

export type FormPickerProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  options: { label: string; value: string | number }[];
  placeholder?: string;
  style?: any;
  pickerContainerStyle?: any;
};

export function FormPicker<T extends FieldValues>({
  control,
  name,
  label,
  options,
  style,
  pickerContainerStyle,
}: FormPickerProps<T>) {
  const { field } = useController({ name });
  const styles = useStyle(stylesheet);
  const { t } = useTheme();
  const { t: translate } = useTranslation();

  if (Platform.OS === "ios") {
    return (
      <>
        {label && <ThemedText style={styles.label}>{label}</ThemedText>}
        <Pressable
          onPress={() =>
            ActionSheetIOS.showActionSheetWithOptions(
              {
                options: [...options.map((option) => option.label), "Cancel"],
                userInterfaceStyle: "dark",
                cancelButtonIndex: options.length,
              },
              (buttonIndex) => {
                field.onChange(
                  options.find((_, index) => index === buttonIndex)?.value,
                );
              },
            )
          }
          style={styles.sheetButton}
        >
          <ThemedText>{field.value ?? translate("select")}</ThemedText>
        </Pressable>
      </>
    );
  }

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
              dropdownIconColor={t.colors.text}
            >
              <Picker.Item label={translate("select")} value="" />
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

const stylesheet = createStyle((t) => ({
  pickerContainer: {
    borderWidth: 1,
    borderColor: t.colors.text + "33",
    borderRadius: 8,
    marginTop: 4,
    height: 55,
    paddingLeft: 4,
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
