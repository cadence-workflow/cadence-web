import {
  type PageQueryParamKeys,
  type PageQueryParamValues,
  type PageQueryParams,
  type PageQueryParamSetterValues,
} from '@/hooks/use-page-query-params/use-page-query-params.types';

export type PageFilterComponentProps<V extends object> = {
  value: V;
  setValue: (value: V) => void;
};

export type PageFilterConfig<
  P extends PageQueryParams,
  V extends Partial<PageQueryParamValues<P>>,
> = {
  id: string;
  getValue: (queryParamsValues: PageQueryParamValues<P>) => V;
  formatValue: (
    value: V
  ) => Pick<
    PageQueryParamSetterValues<P>,
    keyof V extends string ? keyof V : never
  >;
  component: React.ComponentType<PageFilterComponentProps<V>>;
};

export type Props<
  P extends PageQueryParams,
  K extends PageQueryParamKeys<P>,
> = {
  searchQueryParamKey: PageQueryParamValues<P>[K] extends string ? K : never;
  searchPlaceholder: string;
  pageQueryParamsConfig: P;
  pageFiltersConfig: Array<PageFilterConfig<P, any>>;
  searchTrimRegExp?: RegExp;
};
