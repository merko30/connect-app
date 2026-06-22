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

const MediaLinks = ({ control }: Props) => {
  const { t } = useTranslation();
  const styles = useStyle(stylesheet);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "mediaLinks",
  });

  return (
    <View>
      <View style={styles.header}>
        <ThemedText variant="subtitle">{t("profile.mediaLinks")}</ThemedText>

        <RoleBasedButton
          title="+"
          onPress={() => append({ title: "", url: "" })}
          style={styles.addButton}
          textStyle={styles.addButtonText}
        />
      </View>

      {fields.map((field, index) => (
        <View key={field.id} style={styles.container}>
          <View style={styles.card}>
            <ThemedText variant="subtitle">
              {t("profile.mediaLink")} {index + 1}
            </ThemedText>

            <RoleBasedButton
              title="X"
              variant="outline"
              onPress={() => remove(index)}
              style={styles.removeButton}
            />
          </View>

          <FormInput
            control={control}
            objectKey="title"
            name={`mediaLinks.${index}.title`}
            placeholder={t("title")}
            containerStyle={styles.input}
          />

          <FormInput
            control={control}
            objectKey="url"
            name={`mediaLinks.${index}.url`}
            placeholder={t("profile.mediaLink")}
            containerStyle={styles.input}
            // keyboardType="url"
            autoCapitalize="none"
          />
        </View>
      ))}
    </View>
  );
};

export default MediaLinks;

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
    marginBottom: 8,
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
  removeButton: {
    width: 36,
    height: 36,
    padding: 0,
    paddingVertical: 0,
    borderRadius: t.radii.full,
    marginTop: 0,
  },
  input: {
    marginBottom: 8,
  },
}));
