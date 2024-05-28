import {
  PageQueryParamKeys,
  PageQueryParamSetter,
  PageQueryParamValues,
  PageQueryParams,
} from '@/hooks/use-page-query-params/use-page-query-params.types';

export type PageFilterComponentProps<P extends PageQueryParams> = {
  queryParams: PageQueryParamValues<P>;
  setQueryParams: PageQueryParamSetter<P>;
};

export type PageFilterConfig<P extends PageQueryParams> = {
  id: string;
  component: React.ComponentType<PageFilterComponentProps<P>>;
  queryParamKeys: Array<PageQueryParamKeys<P>>;
};

export type Props<
  P extends PageQueryParams,
  K extends PageQueryParamKeys<P>,
> = {
  searchQueryParamKey: PageQueryParamValues<P>[K] extends string ? K : never;
  searchPlaceholder: string;
  pageQueryParamsConfig: P;
  pageFiltersConfig: Array<PageFilterConfig<P>>;
};
