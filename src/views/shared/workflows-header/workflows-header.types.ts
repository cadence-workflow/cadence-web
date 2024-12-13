import { type PageFilterConfig } from '@/components/page-filters/page-filters.types';
import {
  type PageQueryParamValues,
  type PageQueryParamKeys,
  type PageQueryParams,
} from '@/hooks/use-page-query-params/use-page-query-params.types';
import { type ListWorkflowsRequestQueryParams } from '@/route-handlers/list-workflows/list-workflows.types';
import { type SortOrder } from '@/utils/sort-by';

import { type WorkflowStatus } from '../workflow-status-tag/workflow-status-tag.types';

export type WorkflowsHeaderInputType =
  ListWorkflowsRequestQueryParams['inputType'];

export type Props<
  P extends PageQueryParams,
  I extends PageQueryParamKeys<P>,
  S extends PageQueryParamKeys<P>,
  Q extends PageQueryParamKeys<P>,
> = {
  domain: string;
  cluster: string;
  pageQueryParamsConfig: P;
  pageFiltersConfig: Array<PageFilterConfig<P, any>>;
  filtersValues: WorkflowsFiltersValues;
  inputTypeQueryParamKey: PageQueryParamValues<P>[I] extends WorkflowsHeaderInputType
    ? I
    : never;
  searchQueryParamKey: PageQueryParamValues<P>[S] extends string ? S : never;
  queryStringQueryParamKey: PageQueryParamValues<P>[Q] extends string
    ? Q
    : never;
};

export type WorkflowsFiltersValues = {
  inputType: WorkflowsHeaderInputType;
  search?: string;
  status?: WorkflowStatus;
  timeRangeStart?: Date;
  timeRangeEnd?: Date;
  sortColumn: string;
  sortOrder: SortOrder;
  query: string;
};
