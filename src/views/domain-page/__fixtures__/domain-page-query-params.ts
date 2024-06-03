import { type PageQueryParamValues } from '@/hooks/use-page-query-params/use-page-query-params.types';
import domainPageQueryParamsConfig from '../config/domain-page-query-params.config';

export const mockDomainPageQueryParamsValues: PageQueryParamValues<
  typeof domainPageQueryParamsConfig
> = {
  search: '',
  status: undefined,
  startDate: undefined,
  endDate: undefined,
  sortColumn: 'startTime',
  sortOrder: 'DESC',
};

export const mockDateOverrides = {
  startDate: new Date(1684800000000), // 23 May 2023 00:00
  endDate: new Date(1684886400000), // 24 May 2023 00:00
};
