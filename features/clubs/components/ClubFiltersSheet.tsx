import { ReusableBottomSheet } from "@/components/BottomSheet";
import { FormDatePicker } from "@/components/FormDatepicker";
import { FormInput } from "@/components/FormInput";
import { FormPicker } from "@/components/FormPicker";
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

export type ClubFiltersSheetProps = {
  filters: FilterField[];
  onApply: (values: Record<string, any>) => void;
  initialValues?: Record<string, any>;
};

const buildEmptyValues = (filters: FilterField[]) => {
  return filters.reduce<Record<string, any>>((acc, filter) => {
    if (filter.filters?.length) {
      Object.assign(acc, buildEmptyValues(filter.filters));
      return acc;
    }

    acc[filter.name] = "";
    return acc;
  }, {});
};

const ClubFiltersSheet = ({
  filters,
  onApply,
  initialValues = {},
}: ClubFiltersSheetProps) => {
  const styles = useStyle(stylesheet);
  const ref = useRef<BottomSheetModal>(null);
  const { t } = useTranslation();
  const defaultValues = useMemo(
    () => ({
      ...buildEmptyValues(filters),
      ...initialValues,
    }),
    [filters, initialValues],
  );
  const form = useForm({ defaultValues });

  const handleOpen = () => {
    Keyboard.dismiss();
    ref?.current?.present();
    ref?.current?.expand();
  };

  const handleApply = (values: Record<string, any>) => {
    onApply(values);

    ref?.current?.close();
  };

  const renderFilter = (filter: FilterField) => {
    if (filter.type === "number") {
      return (
        <FormInput
          key={filter.name + filter.label}
          control={form.control}
          keyboardType="numeric"
          name={filter.name}
          placeholder={t(filter.label)}
          containerStyle={styles.numberInput}
        />
      );
    }
    if (filter.type === "text") {
      return (
        <FormInput
          key={filter.name}
          control={form.control}
          name={filter.name}
          placeholder={t(filter.label)}
        />
      );
    }
    if (filter.type === "select" && filter.options) {
      return (
        <FormPicker
          key={filter.name}
          control={form.control}
          name={filter.name}
          label={t(filter.label)}
          options={filter.options}
        />
      );
    }
    if (filter.type === "date") {
      return (
        <FormDatePicker
          key={filter.name}
          control={form.control}
          name={filter.name}
          label={t(filter.label)}
        />
      );
    }
    return null;
  };

  return (
    <>
      <TouchableOpacity
        style={styles.icon}
        onPress={handleOpen}
        accessibilityLabel="Filters"
      >
        <IconSymbol name="slider.horizontal.3" size={32} color="#888" />
        {Object.keys(form.formState.dirtyFields).length > 0 && (
          <View style={styles.filterCount}>
            <ThemedText style={styles.filterCountText}>
              {Object.keys(form.formState.dirtyFields).length}
            </ThemedText>
          </View>
        )}
      </TouchableOpacity>
      <ReusableBottomSheet ref={ref}>
        <FormProvider {...form}>
          <ScrollView style={styles.scrollContainer}>
            {filters.map((filter) => {
              if (filter.filters?.length) {
                return (
                  <View key={filter.name}>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 12,
                        flex: 1,
                      }}
                    >
                      {filter.filters.map((subFilter) =>
                        renderFilter(subFilter),
                      )}
                    </View>
                  </View>
                );
              }
              return renderFilter(filter);
            })}
            <ThemedButton
              title={t("apply")}
              onPress={form.handleSubmit(handleApply)}
              style={{ marginTop: 16 }}
            />
            {form.formState.isDirty && (
              <ThemedButton
                title={t("reset")}
                onPress={() => {
                  form.reset(defaultValues);
                  onApply({});
                  ref?.current?.close();
                }}
                variant="secondary"
                style={{ marginTop: 8 }}
              />
            )}
          </ScrollView>
        </FormProvider>
      </ReusableBottomSheet>
    </>
  );
};

const stylesheet = createStyle((t) => ({
  scrollContainer: { padding: 16 },
  icon: {
    position: "relative",
  },
  numberInput: {
    flex: 1,
    marginBottom: t.spacing.sm,
  },
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

ClubFiltersSheet.displayName = "ClubFiltersSheet";

export default ClubFiltersSheet;
