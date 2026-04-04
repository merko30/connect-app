import { CoachProfile } from "@/types/coaches";
import { createResource } from "../resource";

export const coachesApi = createResource<CoachProfile>("/coach-profiles");
