import { api } from "./client";

export function createResource<T>(prefix: string) {
  return {
    list: (params?: string) =>
      api<{ data: T[] }>(`${prefix}${params ? `?${params}` : ""}`),

    get: (id: number | string) => api<T>(`${prefix}/${id}`),

    create: (data: Partial<T>) =>
      api<T>(prefix, {
        method: "POST",
        body: data,
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
