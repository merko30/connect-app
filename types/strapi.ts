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
  | {
      [key: string]:
        | boolean
        | {
            populate?: StrapiPopulate;
            fields?: string[];
          };
    };

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

export type StrapiListResponse<T> = {
  data: T[];
  meta: StrapiMeta;
};

export type StrapiInfiniteResponse<T> = {
  pages: StrapiListResponse<T>[];
  pageParams: number[];
};

export type StrapiMediaType = {
  id: number;
  documentId?: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  formats?: {
    thumbnail?: StrapiMediaFormat;
    small?: StrapiMediaFormat;
    medium?: StrapiMediaFormat;
    large?: StrapiMediaFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata?: unknown;
  createdAt: string;
  updatedAt: string;
};

export type StrapiMediaFormat = {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  url: string;
};
