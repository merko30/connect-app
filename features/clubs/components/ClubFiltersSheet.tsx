import { ReusableBottomSheet } from "@/components/BottomSheet";
import { FormDatePicker } from "@/components/FormDatepicker";
import { FormInput } from "@/components/FormInput";
import { FormPicker } from "@/components/FormPicker";
import { ThemedButton } from "@/components/ThemedButton";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { FilterField } from "@/types/filters";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";

export type ClubFiltersSheetProps = {
  filters: FilterField[];
  onApply: (values: Record<string, any>) => void;
  initialValues?: Record<string, any>;
  iconStyle?: any;
};

export const ClubFiltersSheet = ({
  filters,
  onApply,
  initialValues = {},
  iconStyle,
}: ClubFiltersSheetProps) => {
  const ref = useRef<BottomSheetModal>(null);
  const form = useForm({ defaultValues: initialValues });

  const handleOpen = () => {
    ref?.current?.present();
    ref?.current?.expand();
  };

  const handleApply = (values: Record<string, any>) => {
    onApply(values);
    console.log(console.log(values));

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
          placeholder={filter.label}
          containerStyle={{ flex: 1 }}
        />
      );
    }
    if (filter.type === "text") {
      return (
        <FormInput
          key={filter.name}
          control={form.control}
          name={filter.name}
          placeholder={filter.label}
        />
      );
    }
    if (filter.type === "select" && filter.options) {
      return (
        <FormPicker
          key={filter.name}
          control={form.control}
          name={filter.name}
          label={filter.label}
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
          label={filter.label}
        />
      );
    }
    return null;
  };

  return (
    <>
      <TouchableOpacity
        style={iconStyle}
        onPress={handleOpen}
        accessibilityLabel="Filters"
      >
        <IconSymbol name="slider.horizontal.3" size={24} color="#888" />
      </TouchableOpacity>
      <ReusableBottomSheet ref={ref} snapPoints={["40%", "70%"]}>
        <FormProvider {...form}>
          <View style={{ padding: 16 }}>
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
              title="Apply"
              onPress={form.handleSubmit(handleApply)}
              style={{ marginTop: 16 }}
            />
          </View>
        </FormProvider>
      </ReusableBottomSheet>
    </>
  );
};

ClubFiltersSheet.displayName = "ClubFiltersSheet";

export default ClubFiltersSheet;
