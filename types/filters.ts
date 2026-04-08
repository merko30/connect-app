import { TranslationKey } from "@/i18n";

// Filter field types
export type FilterType = "text" | "select" | "date" | "number";

export type FilterField = {
  name: string;
  label: TranslationKey;
  type?: FilterType;
  options?: { label: string; value: string | number | boolean }[]; // for select
  placeholder?: string;
  strapiOperator?: "$eq" | "$contains" | "$containsi" | "$gte" | "$lte";
  filters?: FilterField[];
};
