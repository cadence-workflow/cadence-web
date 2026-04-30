import {
  type DomainPageInputTypeQueryParamKey,
  type DomainPageStringQueryParamKey,
} from '@/views/domain-page/config/domain-page-query-params.config';
import { type WorkflowsListColumn } from '@/views/shared/workflows-list/workflows-list.types';

export type Props = {
  domain: string;
  cluster: string;
  visibleColumns: Array<WorkflowsListColumn>;
  inputTypeQueryParamKey?: DomainPageInputTypeQueryParamKey;
  queryStringQueryParamKey?: DomainPageStringQueryParamKey;
  timeRangeStart?: string;
  timeRangeEnd?: string;
};
