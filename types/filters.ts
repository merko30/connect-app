// Filter field types
export type FilterType = "text" | "select" | "date" | "number";

export type FilterField = {
  name: string;
  label: string;
  type?: FilterType;
  options?: { label: string; value: string | number }[]; // for select
  placeholder?: string;
  strapiOperator?: "$eq" | "$contains" | "$gte" | "$lte";
  filters?: FilterField[];
};
