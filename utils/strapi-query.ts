import { FilterField } from "@/types/filters";
import { StrapiQuery } from "@/types/strapi";
import qs from "qs";

export function toStrapiQueryString<T>(query?: StrapiQuery<T>): string {
  if (!query) return "";

  return qs.stringify(query, {
    encodeValuesOnly: true,
  });
}

type FiltersInput = Record<string, any>;
type FilterDefinition = FilterField[];

export function buildStrapiFilters(
  values: FiltersInput,
  definitions: FilterDefinition,
  filtersObj?: Record<string, any>,
  isNested?: boolean,
) {
  const filters: Record<string, any> = filtersObj ?? {};

  for (const def of definitions) {
    if (def.filters) {
      filters[def.name] = buildStrapiFilters(
        values,
        def.filters,
        filters[def.name],
        true,
      );
    } else {
      const value = values[def.name];

      if (value === undefined || value === null || value === "") {
        continue;
      }

      if (!filters[def.name] && !isNested) {
        filters[def.name] = {};
      }

      if (!def.strapiOperator) {
        throw new Error("No operator");
      }
      if (isNested) {
        filters[def.strapiOperator] = value;
      } else {
        filters[def.name][def.strapiOperator] = value;
      }
    }
  }

  return Object.entries(filters).reduce<Record<string, any>>(
    (acc, [key, values]) => {
      if (Object.keys(values).length) {
        acc[key] = values;
      }

      return acc;
    },
    {},
  );
}
