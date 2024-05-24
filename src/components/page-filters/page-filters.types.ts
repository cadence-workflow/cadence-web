import {
  PageQueryParamKeys,
  PageQueryParamSetter,
  PageQueryParamValues,
  PageQueryParams,
} from '@/hooks/use-page-query-params/use-page-query-params.types';

export type PageFilterIsSetProps<P extends PageQueryParams> = {
  queryParams: PageQueryParamValues<P>;
};

export type PageFilterComponentProps<T extends PageQueryParams> = {
  queryParams: PageQueryParamValues<T>;
  setQueryParams: PageQueryParamSetter<T>;
};

export type PageFilterConfig<P extends PageQueryParams> = {
  id: string;
  component: React.ComponentType<PageFilterComponentProps<P>>;
  queryParamKeys: Array<PageQueryParamKeys<P>>;
};

export interface Props<
  P extends PageQueryParams,
  K extends PageQueryParamKeys<P>,
> {
  searchId: PageQueryParamValues<P>[K] extends string ? K : never;
  searchPlaceholder: string;
  pageQueryParamsConfig: P;
  pageFiltersConfig: Array<PageFilterConfig<P>>;
}
