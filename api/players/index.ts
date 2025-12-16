import { PlayerProfile } from "@/types/players";
import { createResource } from "../resource";

export const playersApi = createResource<PlayerProfile>("/player-profiles");
