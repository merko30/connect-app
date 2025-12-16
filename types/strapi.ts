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
