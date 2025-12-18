import { StrapiQuery } from "@/types/strapi";
import qs from "qs";

export function toStrapiQueryString<T>(query?: StrapiQuery<T>): string {
  if (!query) return "";

  return qs.stringify(query, {
    encodeValuesOnly: true,
  });
}
