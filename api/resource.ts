import { api } from "./client";

export function createResource<T>(prefix: string) {
  return {
    list: (params?: string) =>
      api<{ data: T[] }>(`${prefix}${params ? `?${params}` : ""}`),

    get: (id: number | string) => api<T>(`${prefix}/${id}`),

    create: (data: Partial<T>, token?: string) =>
      api<T>(prefix, {
        method: "POST",
        body: { data },
        token,
      }),

    update: (id: number | string, data: Partial<T>, token?: string) =>
      api<T>(`${prefix}/${id}`, {
        method: "PUT",
        body: { data },
        token,
      }),

    remove: (id: number | string, token?: string) =>
      api<void>(`${prefix}/${id}`, {
        method: "DELETE",
        token,
      }),
  };
}
