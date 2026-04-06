import { ThemedText } from "@/components/ThemedText";
import { createStyle, useStyle } from "@/theme";
import React from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";

export const CATEGORY_OPTIONS = [
  "u9",
  "u12",
  "u15",
  "u17",
  "u19",
  "senior",
] as const;

interface CategoriesSelectorProps {
  label: string;
  value?: string[];
  onChange: (nextValue: string[]) => void;
  style?: StyleProp<ViewStyle>;
}

export default function CategoriesSelector({
  label,
  value = [],
  onChange,
  style,
}: CategoriesSelectorProps) {
  const styles = useStyle(stylesheet);

  const toggleCategory = (category: string) => {
    const nextValue = value.includes(category)
      ? value.filter((item) => item !== category)
      : [...value, category];

    onChange(nextValue);
  };

  return (
    <View style={[styles.container, style]}>
      <ThemedText style={styles.label}>{label}</ThemedText>

      <View style={styles.chipsWrap}>
        {CATEGORY_OPTIONS.map((category) => {
          const isSelected = value.includes(category);

          return (
            <Pressable
              key={category}
              onPress={() => toggleCategory(category)}
              style={[styles.chip, isSelected && styles.chipSelected]}
            >
              <ThemedText
                style={[styles.chipText, isSelected && styles.chipTextSelected]}
              >
                {category === "senior" ? "Senior" : category.toUpperCase()}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const stylesheet = createStyle((t) => ({
  container: {
    marginBottom: t.spacing.sm,
  },
  label: {
    marginBottom: t.spacing.xs,
    fontWeight: "600",
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    paddingHorizontal: t.spacing.sm,
    paddingVertical: t.spacing.xs,
    borderRadius: t.radii.full,
    borderWidth: 1,
    borderColor: t.colors.text + "22",
    backgroundColor: t.colors.surface,
    marginRight: t.spacing.xs,
    marginBottom: t.spacing.xs,
  },
  chipSelected: {
    backgroundColor: t.colors.primary,
    borderColor: t.colors.primary,
  },
  chipText: {
    fontWeight: "500",
  },
  chipTextSelected: {
    color: "#fff",
  },
}));
