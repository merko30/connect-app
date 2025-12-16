import { ClubProfile } from "@/types/clubs";
import { createResource } from "../resource";

export const clubsApi = createResource<ClubProfile>("/clubs");
