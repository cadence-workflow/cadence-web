import { type PageFilterConfig } from '@/components/page-filters/page-filters.types';

import DomainWorkflowsFiltersDates from '../domain-workflows-filters-dates/domain-workflows-filters-dates';
import { type DomainWorkflowsFiltersDatesValue } from '../domain-workflows-filters-dates/domain-workflows-filters-dates.types';
import DomainWorkflowsFiltersStatus from '../domain-workflows-filters-status/domain-workflows-filters-status';
import { type DomainWorkflowsFiltersStatusValue } from '../domain-workflows-filters-status/domain-workflows-filters-status-types';

import type domainWorkflowsQueryParamsConfig from './domain-workflows-query-params.config';

const domainWorkflowsFiltersConfig: [
  PageFilterConfig<
    typeof domainWorkflowsQueryParamsConfig,
    DomainWorkflowsFiltersStatusValue
  >,
  PageFilterConfig<
    typeof domainWorkflowsQueryParamsConfig,
    DomainWorkflowsFiltersDatesValue
  >,
] = [
  {
    id: 'status',
    getValue: (v) => ({ status: v.status }),
    formatValue: (v) => v,
    component: DomainWorkflowsFiltersStatus,
  },
  {
    id: 'dates',
    getValue: (v) => ({
      timeRangeStart: v.timeRangeStart,
      timeRangeEnd: v.timeRangeEnd,
    }),
    formatValue: (v) => ({
      timeRangeStart: v.timeRangeStart?.toISOString(),
      timeRangeEnd: v.timeRangeEnd?.toISOString(),
    }),
    component: DomainWorkflowsFiltersDates,
  },
] as const;

export default domainWorkflowsFiltersConfig;
