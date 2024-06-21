import { type PageQueryParamValues } from '@/hooks/use-page-query-params/use-page-query-params.types';

import type domainPageQueryParamsConfig from '../config/domain-page-query-params.config';

export const mockDomainPageQueryParamsValues: PageQueryParamValues<
  typeof domainPageQueryParamsConfig
> = {
  search: '',
  status: undefined,
  timeRangeStart: undefined,
  timeRangeEnd: undefined,
  sortColumn: 'startTime',
  sortOrder: 'DESC',
};

export const mockDateOverrides = {
  timeRangeStart: new Date(1684800000000), // 23 May 2023 00:00
  timeRangeEnd: new Date(1684886400000), // 24 May 2023 00:00
};
