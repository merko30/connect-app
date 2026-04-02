import { FormDatePicker } from "@/components/FormDatepicker";
import { FormInput } from "@/components/FormInput";
import { FormPicker } from "@/components/FormPicker";
import { FilterField } from "@/types/filters";
import { Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

type Props = {
  filter: FilterField;
  control: Control<any>;
  numberInputStyle?: any;
};

export function FilterFieldRenderer({
  filter,
  control,
  numberInputStyle,
}: Props) {
  const { t } = useTranslation();

  if (filter.filters?.length) {
    return (
      <View
        key={filter.name}
        style={{ flexDirection: "row", gap: 12, flex: 1 }}
      >
        {filter.filters.map((sub) => (
          <FilterFieldRenderer
            key={sub.name}
            filter={sub}
            control={control}
            numberInputStyle={numberInputStyle}
          />
        ))}
      </View>
    );
  }

  if (filter.type === "number") {
    return (
      <FormInput
        key={filter.name + filter.label}
        control={control}
        keyboardType="numeric"
        name={filter.name}
        placeholder={t(filter.label)}
        containerStyle={numberInputStyle}
      />
    );
  }

  if (filter.type === "text") {
    return (
      <FormInput
        key={filter.name}
        control={control}
        name={filter.name}
        placeholder={t(filter.label)}
      />
    );
  }

  if (filter.type === "select" && filter.options) {
    return (
      <FormPicker
        key={filter.name}
        control={control}
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
        control={control}
        name={filter.name}
        label={t(filter.label)}
      />
    );
  }

  return null;
}
