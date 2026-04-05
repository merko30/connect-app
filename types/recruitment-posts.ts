import { ClubProfile } from "./clubs";
import { CoachType } from "./coaches";
import { User } from "./users";

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

export type RecruitmentPostType = "player" | "coach";

export type RecruitmentPost = {
  id: number;
  documentId?: string;
  title: string;
  type?: RecruitmentPostType | null;
  position: RecruitmentPosition;
  coachType?: CoachType | null;

  note?: string | null;
  level?: "youth" | "amateur" | "semi-pro" | "pro" | null;
  postStatus?: "open" | "paused" | "closed" | null;
  deadline?: string | null;
  contractType?: "trial" | "short-term" | "full-season" | "permanent" | null;
  requirements?: string | null;
  interested?: Pick<User, "id" | "documentId">[];

  club?: ClubProfile | null;

  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};
