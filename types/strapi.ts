export type StrapiMeta = {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
};

export type StrapiMedia = {
  id: number;
  attributes: {
    url: string;
    mime: string;
    width?: number;
    height?: number;
  };
};

export type StrapiUser = {
  id: number;
  username: string;
  email: string;
};

export type StrapiSort =
  | string
  | `${string}:asc`
  | `${string}:desc`
  | (string | `${string}:asc` | `${string}:desc`)[];

export type StrapiPopulate =
  | string
  | string[]
  | Record<string, boolean | { populate?: StrapiPopulate }>;

type StrapiOperator<T> = {
  $eq?: T;
  $ne?: T;
  $contains?: string;
  $containsi?: string;
  $in?: T[];
  $notNull?: boolean;
  $null?: boolean;
};

type StrapiFieldFilters<T> = {
  [K in keyof T]?: StrapiOperator<T[K]>;
};

export type StrapiFilters<T> =
  | StrapiFieldFilters<T>
  | {
      $and?: StrapiFilters<T>[];
      $or?: StrapiFilters<T>[];
    };

export type StrapiQuery<T> = {
  filters?: StrapiFilters<T>;
  populate?: StrapiPopulate;
  sort?: StrapiSort;
  pagination?: {
    page?: number;
    pageSize?: number;
  };
};
