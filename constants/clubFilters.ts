import { PRIMARY_POSITIONS } from "@/features/auth/constants";
import { FilterField } from "@/types/filters";

export const CLUB_FILTERS: FilterField[] = [
  {
    name: "primaryPosition",
    label: "Position",
    type: "select",
    options: PRIMARY_POSITIONS.map((p) => ({
      label: p,
      value: p,
    })),
    strapiOperator: "$eq",
  },

  {
    name: "preferredFoot",
    label: "Preferred Foot",
    type: "select",
    options: [
      { label: "Left", value: "left" },
      { label: "Right", value: "right" },
      { label: "Both", value: "both" },
    ],
    strapiOperator: "$eq",
  },

  {
    name: "heightCm",
    label: "Height",
    filters: [
      {
        name: "minHeightCm",
        label: "Min Height",
        type: "number",
        strapiOperator: "$gte",
      },
      {
        name: "maxHeightCm",
        label: "Max Height",
        type: "number",
        strapiOperator: "$lte",
      },
    ],
  },
  {
    name: "availabilityFrom",
    label: "Available from",
    type: "date",
    strapiOperator: "$lte",
  },

  {
    name: "isFreeAgent",
    label: "Free Agent",
    type: "select",
    options: [
      { label: "Yes", value: 1 },
      { label: "No", value: 0 },
    ],
    strapiOperator: "$eq",
  },
];
