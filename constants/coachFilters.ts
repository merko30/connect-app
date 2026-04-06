import { FilterField } from "@/types/filters";

export const COACH_FILTERS: FilterField[] = [
  {
    name: "coachType",
    label: "register.coachType",
    type: "select",
    options: [
      { label: "coachTypes.head-coach", value: "head-coach" },
      { label: "coachTypes.assistant-coach", value: "assistant-coach" },
      { label: "coachTypes.goalkeeping-coach", value: "goalkeeping-coach" },
      { label: "coachTypes.fitness-coach", value: "fitness-coach" },
      { label: "coachTypes.analyst", value: "analyst" },
    ],
    strapiOperator: "$eq",
  },
  {
    name: "experienceLevel",
    label: "register.experienceLevel",
    type: "select",
    options: [
      { label: "experienceLevels.youth", value: "youth" },
      { label: "experienceLevels.amateur", value: "amateur" },
      { label: "experienceLevels.semi-pro", value: "semi-pro" },
      { label: "experienceLevels.pro", value: "pro" },
    ],
    strapiOperator: "$eq",
  },
  {
    name: "isAvailable",
    label: "register.isAvailable",
    type: "select",
    options: [
      { label: "common.yes", value: 1 },
      { label: "common.no", value: 0 },
    ],
    strapiOperator: "$eq",
  },
  {
    name: "location",
    label: "register.city",
    type: "text",
    strapiOperator: "$contains",
  },
];
