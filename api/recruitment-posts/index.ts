import { RecruitmentPost } from "@/types/recruitment-posts";
import { createResource } from "../resource";

export const recruitmentPostsApi =
  createResource<RecruitmentPost>("/recruitment-posts");

export const addRecruitmentPostInterest = (id: string | number) =>
  recruitmentPostsApi.custom<void>(`/recruitment-posts/${id}/interest`, {
    method: "POST",
  });

export const removeRecruitmentPostInterest = (id: string | number) =>
  recruitmentPostsApi.custom<void>(`/recruitment-posts/${id}/interest`, {
    method: "DELETE",
  });
