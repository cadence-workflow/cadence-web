import { type PageQueryParamValues } from '@/hooks/use-page-query-params/use-page-query-params.types';
import type domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';

export const mockDomainPageQueryParamsValues = {
  inputType: 'search',
  search: '',
  statuses: undefined,
  timeRangeStart: 'now',
  timeRangeEnd: 'now-7d',
  sortColumn: 'startTime',
  sortOrder: 'DESC',
  query: '',
  workflowId: '',
  workflowType: '',
  statusBasic: undefined,
  timeRangeStartBasic: 'now',
  timeRangeEndBasic: 'now-7d',
  inputTypeArchival: 'search',
  searchArchival: '',
  statusesArchival: undefined,
  timeRangeStartArchival: new Date('2024-11-17T03:24:00'),
  timeRangeEndArchival: new Date('2024-12-17T03:24:00'),
  sortColumnArchival: 'startTime',
  sortOrderArchival: 'DESC',
  queryArchival: '',
  clusterAttributeScope: undefined,
  clusterAttributeValue: undefined,
} as const satisfies PageQueryParamValues<typeof domainPageQueryParamsConfig>;
