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
  position: RecruitmentPosition;
  note?: string | null;

  club?: ClubProfile;

  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};
