import { PRIMARY_POSITIONS } from "@/features/auth/constants";
import { FilterField } from "@/types/filters";

const COMMON_RECRUITMENT_POST_FILTERS: FilterField[] = [
  {
    name: "level",
    label: "recruitmentPost.level",
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
    name: "contractType",
    label: "recruitmentPost.contractType",
    type: "select",
    options: [
      { label: "contractTypes.trial", value: "trial" },
      { label: "contractTypes.short-term", value: "short-term" },
      { label: "contractTypes.full-season", value: "full-season" },
      { label: "contractTypes.permanent", value: "permanent" },
    ],
    strapiOperator: "$eq",
  },
];

export const PLAYER_RECRUITMENT_POST_FILTERS: FilterField[] = [
  {
    name: "position",
    label: "register.primaryPosition",
    type: "select",
    options: PRIMARY_POSITIONS.map((position) => ({
      label: position,
      value: position,
    })),
    strapiOperator: "$eq",
  },
  ...COMMON_RECRUITMENT_POST_FILTERS,
];

export const COACH_RECRUITMENT_POST_FILTERS: FilterField[] = [
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
  ...COMMON_RECRUITMENT_POST_FILTERS,
];

export const RECRUITMENT_POST_FILTERS = PLAYER_RECRUITMENT_POST_FILTERS;
