import { RecruitmentPost } from "@/types/recruitment-posts";
import { createResource } from "../resource";

export const recruitmentPostsApi =
  createResource<RecruitmentPost>("/recruitment-posts");
