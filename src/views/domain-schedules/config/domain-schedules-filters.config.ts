import { type PageFilterConfig } from '@/components/page-filters/page-filters.types';

import DomainSchedulesFiltersStatus from '../domain-schedules-filters-status/domain-schedules-filters-status';
import { type DomainSchedulesFiltersStatusValue } from '../domain-schedules-filters-status/domain-schedules-filters-status.types';

import type domainSchedulesQueryParamsConfig from './domain-schedules-query-params.config';

const domainSchedulesFiltersConfig: [
  PageFilterConfig<
    typeof domainSchedulesQueryParamsConfig,
    DomainSchedulesFiltersStatusValue
  >,
] = [
  {
    id: 'status',
    getValue: (v) => ({ schedulesStatus: v.schedulesStatus }),
    formatValue: (v) => v,
    component: DomainSchedulesFiltersStatus,
  },
] as const;

export default domainSchedulesFiltersConfig;
