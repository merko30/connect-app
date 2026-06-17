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
          onPress={() =>
            append({ name: "", appearances: "", goals: "", assists: "" })
          }
          style={styles.addButton}
          textStyle={styles.addButtonText}
        />
      </View>

      {/* Inputs */}
      {fields.map((field, index) => (
        <View key={field.id} style={styles.container}>
          <View style={styles.card}>
            <ThemedText variant="subtitle">
              {t("register.formerClub") + " " + (index + 1)}
            </ThemedText>

            {/* Optional remove button */}
            <RoleBasedButton
              title={"X"}
              variant="outline"
              onPress={() => remove(index)}
              style={styles.removeButton}
            />
          </View>
          <View style={{ flex: 1 }}>
            <FormInput
              control={control}
              objectKey="name"
              name={`formerClubs.${index}.name`}
              placeholder={"Naziv"}
              containerStyle={styles.input}
            />
            <View style={styles.row}>
              <FormInput
                control={control}
                objectKey="appearances"
                name={`formerClubs.${index}.appearances`}
                placeholder={t("register.appearances")}
                containerStyle={styles.input}
              />
              <FormInput
                control={control}
                objectKey="goals"
                name={`formerClubs.${index}.goals`}
                placeholder={t("register.scoredGoals")}
                containerStyle={styles.input}
              />
              <FormInput
                control={control}
                objectKey="assists"
                name={`formerClubs.${index}.assists`}
                placeholder={t("register.assists")}
                containerStyle={styles.input}
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const stylesheet = createStyle((t) => ({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  container: {
    backgroundColor: t.colors.surface,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    gap: 8,
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
    backgroundColor: t.colors.surface + "33",
  },
  removeButton: {
    width: 36,
    height: 36,
    padding: 0,
    paddingVertical: 0,
    borderRadius: t.radii.full,
    marginTop: 0,
  },
  input: {
    flex: 4,
  },
}));
