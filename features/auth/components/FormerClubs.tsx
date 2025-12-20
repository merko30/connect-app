import { FormInput } from "@/components/FormInput";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { Control, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { PlayerRegisterForm } from "../constants";

type Props = {
  control: Control<PlayerRegisterForm>;
};

export default function FormerClubsFieldArray({ control }: Props) {
  const { t } = useTranslation();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "formerClubs",
  });

  return (
    <View>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <ThemedText variant="subtitle">{t("register.formerClubs")}</ThemedText>

        <ThemedButton
          title="+"
          onPress={() => append({ name: "" })}
          style={{
            width: 50,
            height: 50,
            borderRadius: 9999,
          }}
        />
      </View>

      {/* Inputs */}
      {fields.map((field, index) => (
        <View
          key={field.id}
          style={{
            marginBottom: 8,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <FormInput
            control={control}
            objectKey="name"
            name={`formerClubs.${index}.name`}
            placeholder={`${t("register.formerClub")} ${index + 1}`}
          />

          {/* Optional remove button */}
          <ThemedButton
            title={t("remove")}
            variant="secondary"
            onPress={() => remove(index)}
            style={{
              padding: 4,
              paddingVertical: 4,
              height: 48,
            }}
          />
        </View>
      ))}
    </View>
  );
}
