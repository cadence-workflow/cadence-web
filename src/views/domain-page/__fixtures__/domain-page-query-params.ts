import { type PageQueryParamValues } from '@/hooks/use-page-query-params/use-page-query-params.types';
import type domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';

export const mockDomainPageQueryParamsValues = {
  inputType: 'search',
  search: '',
  status: undefined,
  timeRangeStart: undefined,
  timeRangeEnd: undefined,
  sortColumn: 'startTime',
  sortOrder: 'DESC',
  query: '',
  cron: undefined,
  workflowId: '',
  workflowType: '',
  statusBasic: undefined,
  inputTypeArchival: 'search',
  searchArchival: '',
  statusArchival: undefined,
  timeRangeStartArchival: undefined,
  timeRangeEndArchival: undefined,
  sortColumnArchival: 'startTime',
  sortOrderArchival: 'DESC',
  queryArchival: '',
  cronArchival: undefined,
} as const satisfies PageQueryParamValues<typeof domainPageQueryParamsConfig>;
