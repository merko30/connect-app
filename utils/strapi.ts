type Params = Record<string, any>;

interface StrapiQuery {
  filters?: Record<string, any>;
  sort?: string[];
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  populate?: string | string[];
}

export function buildStrapiQuery(params: Params): StrapiQuery {
  const query: StrapiQuery = {};

  // Destructure known keys
  const { sort, page, pageSize, populate, ...filters } = params;

  // Filters
  if (Object.keys(filters).length) {
    query.filters = {};
    for (const key in filters) {
      const value = filters[key];
      // Simple equality; extend for operators if needed
      query.filters[key] = { $eq: value };
    }
  }

  // Sort
  if (sort) {
    query.sort = Array.isArray(sort) ? sort : [sort];
  }

  // Pagination
  if (page || pageSize) {
    query.pagination = {};
    if (page) query.pagination.page = Number(page);
    if (pageSize) query.pagination.pageSize = Number(pageSize);
  }

  // Populate
  if (populate) {
    query.populate = populate;
  }

  return query;
}

export function buildStrapiUrl(base: string, params: Params): string {
  const queryParts: string[] = [];

  // Handle filters
  const { sort, page, pageSize, populate, ...filters } = params;
  for (const key in filters) {
    queryParts.push(`filters[${key}][$eq]=${encodeURIComponent(filters[key])}`);
  }

  // Sort
  if (sort) {
    const sortStr = Array.isArray(sort) ? sort.join(",") : sort;
    queryParts.push(`sort=${encodeURIComponent(sortStr)}`);
  }

  // Pagination
  if (page) queryParts.push(`pagination[page]=${page}`);
  if (pageSize) queryParts.push(`pagination[pageSize]=${pageSize}`);

  // Populate
  if (populate) {
    const populateStr = Array.isArray(populate) ? populate.join(",") : populate;
    queryParts.push(`populate=${encodeURIComponent(populateStr)}`);
  }

  const queryString = queryParts.join("&");
  return queryString ? `${base}?${queryString}` : base;
}
