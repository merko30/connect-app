import { ClubProfile } from "./clubs";

export type RecruitmentPosition =
  | "GK"
  | "CB"
  | "LB"
  | "RB"
  | "CDM"
  | "CM"
  | "LM"
  | "RM"
  | "CAM"
  | "LW"
  | "RW"
  | "ST"
  | "CF";

export type RecruitmentPost = {
  id: number;
  documentId?: string;
  title: string;
  position: RecruitmentPosition;

  note?: string | null;
  level?: "youth" | "amateur" | "semi-pro" | "pro" | null;
  postStatus?: "open" | "paused" | "closed" | null;
  deadline?: string | null;
  contractType?: "trial" | "short-term" | "full-season" | "permanent" | null;
  requirements?: string | null;
  interestedPlayers?: { id: number }[];

  club?: ClubProfile | null;

  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};
