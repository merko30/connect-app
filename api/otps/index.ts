import { Otp } from "@/types/otp";
import { createResource } from "../resource";

export const otpsApi = createResource<Otp>("/otps");
