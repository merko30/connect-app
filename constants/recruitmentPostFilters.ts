import { PRIMARY_POSITIONS } from "@/features/auth/constants";
import { FilterField } from "@/types/filters";

export const RECRUITMENT_POST_FILTERS: FilterField[] = [
  {
    name: "position",
    label: "register.primaryPosition",
    type: "select",
    options: PRIMARY_POSITIONS.map((position) => ({
      label: `positions.${position}`,
      value: position,
    })),
    strapiOperator: "$eq",
  },
];
