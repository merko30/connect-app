import { StrapiListResponse, StrapiQuery } from "@/types/strapi";
import { toStrapiQueryString } from "@/utils/strapi-query";
import { api } from "./client";

export function createResource<T>(prefix: string) {
  return {
    list: (query?: StrapiQuery<T>) => {
      const qs = toStrapiQueryString(query);
      console.log(qs);

      return api<StrapiListResponse<T>>(`${prefix}${qs ? `?${qs}` : ""}`);
    },

    get: (id: number | string, query?: StrapiQuery<T>) => {
      const qs = toStrapiQueryString(query);
      return api<T>(`${prefix}/${id}${qs ? `?${qs}` : ""}`);
    },

    create: (data: Partial<T>) =>
      api<T>(prefix, {
        method: "POST",
        body: { data },
      }),

    update: (id: number | string, data: Partial<T>) =>
      api<T>(`${prefix}/${id}`, {
        method: "PUT",
        body: { data },
      }),

    remove: (id: number | string) =>
      api<void>(`${prefix}/${id}`, {
        method: "DELETE",
      }),

    custom: <R>(url: string, options?: any) => api<R>(url, options),
  };
}
