import { ReusableBottomSheet } from "@/components/BottomSheet";
import { FilterFieldRenderer } from "@/components/FilterFieldRenderer";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { createStyle, useStyle } from "@/theme";
import { FilterField } from "@/types/filters";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useMemo, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, ScrollView, TouchableOpacity, View } from "react-native";

export type FiltersSheetProps = {
  filters: FilterField[];
  onApply: (values: Record<string, any>) => void;
  initialValues?: Record<string, any>;
  iconStyle?: any;
};

export const buildEmptyValues = (filters: FilterField[]): Record<string, any> =>
  filters.reduce<Record<string, any>>((acc, filter) => {
    if (filter.filters?.length) {
      Object.assign(acc, buildEmptyValues(filter.filters));
    } else {
      acc[filter.name] = "";
    }
    return acc;
  }, {});

export function FiltersSheet({
  filters,
  onApply,
  initialValues = {},
  iconStyle,
}: FiltersSheetProps) {
  const styles = useStyle(stylesheet);
  const ref = useRef<BottomSheetModal>(null);
  const { t } = useTranslation();

  const defaultValues = useMemo(
    () => ({ ...buildEmptyValues(filters), ...initialValues }),
    [filters, initialValues],
  );

  const form = useForm({ defaultValues });
  const dirtyCount = Object.keys(form.formState.dirtyFields).length;

  const handleOpen = () => {
    Keyboard.dismiss();
    ref.current?.present();
    ref.current?.expand();
  };

  const handleApply = (values: Record<string, any>) => {
    onApply(values);
    ref.current?.close();
  };

  const handleReset = () => {
    form.reset(defaultValues);
    onApply({});
    ref.current?.close();
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.icon, iconStyle]}
        onPress={handleOpen}
        accessibilityLabel="Filters"
      >
        <IconSymbol name="slider.horizontal.3" size={32} color="#888" />
        {dirtyCount > 0 && (
          <View style={styles.filterCount}>
            <ThemedText style={styles.filterCountText}>{dirtyCount}</ThemedText>
          </View>
        )}
      </TouchableOpacity>

      <ReusableBottomSheet ref={ref}>
        <FormProvider {...form}>
          <ScrollView style={styles.scrollContainer}>
            {filters.map((filter) => (
              <FilterFieldRenderer
                key={filter.name}
                filter={filter}
                control={form.control}
                numberInputStyle={styles.numberInput}
              />
            ))}
            <ThemedButton
              title={t("apply")}
              onPress={form.handleSubmit(handleApply)}
              style={{ marginTop: 16 }}
            />
            {form.formState.isDirty && (
              <ThemedButton
                title={t("reset")}
                onPress={handleReset}
                variant="secondary"
                style={{ marginTop: 8 }}
              />
            )}
          </ScrollView>
        </FormProvider>
      </ReusableBottomSheet>
    </>
  );
}

const stylesheet = createStyle((t) => ({
  scrollContainer: { padding: 16 },
  icon: { position: "relative" },
  numberInput: { flex: 1, marginBottom: t.spacing.sm },
  filterCount: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: t.colors.primary,
    borderRadius: 8,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  filterCountText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
}));
