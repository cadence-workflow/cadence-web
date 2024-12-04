import {
  type PageQueryParamKeys,
  type PageQueryParamValues,
  type PageQueryParams,
} from '@/hooks/use-page-query-params/use-page-query-params.types';

export type Props<
  P extends PageQueryParams,
  K extends PageQueryParamKeys<P>,
> = {
  pageQueryParamsConfig: P;
  searchQueryParamKey: PageQueryParamValues<P>[K] extends string ? K : never;
  searchPlaceholder: string;
  searchTrimRegExp?: RegExp;
  inputDebounceDurationMs?: number;
};
