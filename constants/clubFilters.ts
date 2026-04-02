import { FilterField } from "@/types/filters";

export const CLUB_FILTERS: FilterField[] = [
  {
    name: "level",
    label: "register.level",
    type: "select",
    options: [
      { label: "register.amateur", value: "amateur" },
      { label: "register.semiPro", value: "semi-pro" },
      { label: "register.pro", value: "pro" },
    ],
    strapiOperator: "$eq",
  },
];
