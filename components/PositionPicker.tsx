import {
  PlayerRegisterForm,
  SECONDARY_POSITIONS,
} from "@/features/auth/constants";
import { createStyle, useStyle } from "@/theme";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import Toast from "react-native-toast-message";
import { ThemedText } from "./ThemedText";

const PositionPicker = () => {
  const form = useFormContext<PlayerRegisterForm>();
  const styles = useStyle(stylesheet);
  const { t } = useTranslation();

  const selectedPositions =
    useWatch({ name: "secondaryPositions", control: form.control }) || [];

  return (
    <>
      <ThemedText style={styles.label}>
        {t("register.secondaryPosition")}
      </ThemedText>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 4,
        }}
      >
        {SECONDARY_POSITIONS.map((pos) => {
          const selected = selectedPositions.includes(pos);

          return (
            <Pressable
              key={pos}
              style={[styles.pillow, selected && styles.activePillow]}
              onPress={() => {
                const updated = selected
                  ? selectedPositions.filter((p) => p !== pos)
                  : [...selectedPositions, pos];

                if (updated.length > 3) {
                  Toast.show({
                    type: "error",
                    text1: t("register.maxSecondaryPositions"),
                  });
                  return;
                }

                form.setValue("secondaryPositions", updated, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
              }}
            >
              <ThemedText>{pos}</ThemedText>
            </Pressable>
          );
        })}
      </View>
    </>
  );
};

const stylesheet = createStyle((t) => ({
  pillow: {
    backgroundColor: t.colors.surface,
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  activePillow: {
    backgroundColor: t.colors.secondary,
  },
  label: {},
}));

export default PositionPicker;
