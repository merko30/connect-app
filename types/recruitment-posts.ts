import { ClubProfile } from "./clubs";
import { CoachProfile, CoachType } from "./coaches";
import { PlayerProfile } from "./players";
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

export type RecruitmentInterestedUser = Pick<
  User,
  "id" | "documentId" | "firstName" | "lastName"
> & {
  playerProfile?: Pick<
    PlayerProfile,
    "id" | "documentId" | "primaryPosition"
  > | null;
  coachProfile?: Pick<CoachProfile, "id" | "documentId" | "coachType"> | null;
};

export type RecruitmentPost = {
  id: number;
  documentId?: string;
  title: string;
  type?: RecruitmentPostType | null;
  position?: RecruitmentPosition | null;
  coachType?: CoachType | null;
  categories?: string[] | null;

  note?: string | null;
  level?: "youth" | "amateur" | "semi-pro" | "pro" | null;
  postStatus?: "open" | "paused" | "closed" | null;
  deadline?: string | null;
  contractType?: "trial" | "short-term" | "full-season" | "permanent" | null;
  requirements?: string | null;
  interested?: RecruitmentInterestedUser[];

  club?: ClubProfile | null;

  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};
