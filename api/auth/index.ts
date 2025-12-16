import { User } from "@/types/users";
import { createResource } from "../resource";

export const usersApi = createResource<User>("/users");
