import { StrapiInfiniteResponse, StrapiListResponse } from "@/types/strapi";
import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";

type UseStrapiInfiniteQueryOptions<T, E = Error> = {
  queryKey: readonly unknown[];
  queryFn: (params: { page: number }) => Promise<StrapiInfiniteResponse<T>>;
  pageSize?: number;
} & Omit<
  UseInfiniteQueryOptions<StrapiListResponse<T>, E>,
  "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
>;

/**
 * Generic Strapi infinite query hook
 */
export function useStrapiInfiniteQuery<T>({
  queryKey,
  queryFn,
  ...options
}: UseStrapiInfiniteQueryOptions<T>) {
  return useInfiniteQuery({
    queryKey,
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const page =
        typeof pageParam === "number" ? pageParam : Number(pageParam);
      return queryFn({ page });
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.meta?.pagination;
      if (!pagination) return undefined;
      const { page, pageCount } = pagination;
      return page < pageCount ? page + 1 : undefined;
    },
    ...options,
  });
}
