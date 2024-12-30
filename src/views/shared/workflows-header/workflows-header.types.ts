import { type PageFilterConfig } from '@/components/page-filters/page-filters.types';
import {
  type PageQueryParamValues,
  type PageQueryParamKeys,
  type PageQueryParams,
} from '@/hooks/use-page-query-params/use-page-query-params.types';
import { type ListWorkflowsRequestQueryParams } from '@/route-handlers/list-workflows/list-workflows.types';

export type WorkflowsHeaderInputType =
  ListWorkflowsRequestQueryParams['inputType'];

export type Props<
  P extends PageQueryParams,
  I extends PageQueryParamKeys<P>,
  S extends PageQueryParamKeys<P>,
  Q extends PageQueryParamKeys<P>,
> = {
  pageQueryParamsConfig: P;
  pageFiltersConfig: Array<PageFilterConfig<P, any>>;
  inputTypeQueryParamKey: PageQueryParamValues<P>[I] extends WorkflowsHeaderInputType
    ? I
    : never;
  searchQueryParamKey: PageQueryParamValues<P>[S] extends string ? S : never;
  queryStringQueryParamKey: PageQueryParamValues<P>[Q] extends string
    ? Q
    : never;
  refetchQuery: () => void;
  isQueryRunning: boolean;
};
