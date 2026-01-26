import { createResource } from "./resource";

export interface Config {
  stripe_pk: string;
}

export const configApi = createResource<Config>("/configs");
