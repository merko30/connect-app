import { FormInput } from "@/components/FormInput";
import RoleBasedButton from "@/components/RoleBasedButton";
import { ThemedText } from "@/components/ThemedText";
import { createStyle, useStyle } from "@/theme";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
type Props = {
  control: any;
};

export default function FormerClubsFieldArray({ control }: Props) {
  const { t } = useTranslation();
  const styles = useStyle(stylesheet);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "formerClubs",
  });

  return (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText variant="subtitle">{t("register.formerClubs")}</ThemedText>

        <RoleBasedButton
          title="+"
          onPress={() => append({ name: "" })}
          style={styles.addButton}
          textStyle={styles.addButtonText}
        />
      </View>

      {/* Inputs */}
      {fields.map((field, index) => (
        <View key={field.id} style={styles.inputRow}>
          <FormInput
            control={control}
            objectKey="name"
            name={`formerClubs.${index}.name`}
            placeholder={`${t("register.formerClub")} ${index + 1}`}
            containerStyle={styles.input}
          />

          {/* Optional remove button */}
          <RoleBasedButton
            title={t("remove")}
            variant="outline"
            onPress={() => remove(index)}
            style={styles.removeButton}
          />
        </View>
      ))}
    </View>
  );
}

const stylesheet = createStyle(() => ({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  addButton: {
    width: 42,
    height: 42,
    minHeight: 42,
    borderRadius: 9999,
    marginTop: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  addButtonText: {
    fontSize: 24,
    lineHeight: 24,
    fontWeight: "800",
  },
  inputRow: {
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  removeButton: {
    padding: 4,
    paddingVertical: 4,
    height: 48,
    flex: 1,
    marginTop: 0,
  },
  input: {
    flex: 4,
  },
}));
