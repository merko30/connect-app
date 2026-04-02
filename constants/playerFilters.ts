import { PRIMARY_POSITIONS } from "@/features/auth/constants";
import { FilterField } from "@/types/filters";
// Translation keys for filters
// Use these keys with your translation function (e.g., t(key)) in UI

export const PLAYER_FILTERS: FilterField[] = [
  {
    name: "primaryPosition",
    label: "register.primaryPosition", // translation key
    type: "select",
    options: PRIMARY_POSITIONS.map((p) => ({
      label: p,
      value: p,
    })),
    strapiOperator: "$eq",
  },

  {
    name: "preferredFoot",
    label: "register.preferredFoot", // translation key
    type: "select",
    options: [
      { label: "register.left", value: "left" },
      { label: "register.right", value: "right" },
    ],
    strapiOperator: "$eq",
  },

  {
    name: "heightCm",
    label: "register.height", // translation key
    filters: [
      {
        name: "minHeightCm",
        label: "filters.minHeight", // Add to i18n if not present
        type: "number",
        strapiOperator: "$gte",
      },
      {
        name: "maxHeightCm",
        label: "filters.maxHeight", // Add to i18n if not present
        type: "number",
        strapiOperator: "$lte",
      },
    ],
  },
  {
    name: "availabilityFrom",
    label: "register.availableFrom", // translation key
    type: "date",
    strapiOperator: "$lte",
  },

  {
    name: "isFreeAgent",
    label: "register.isFreeAgent", // translation key
    type: "select",
    options: [
      { label: "common.yes", value: 1 }, // Add "common.yes" to i18n if not present
      { label: "common.no", value: 0 }, // Add "common.no" to i18n if not present
    ],
    strapiOperator: "$eq",
  },
];
