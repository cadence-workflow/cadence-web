import { type PageFilterConfig } from '@/components/page-filters/page-filters.types';
import type domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';

import DomainWorkflowsFiltersDates from '../domain-workflows-filters-dates/domain-workflows-filters-dates';
import { type DomainWorkflowsFiltersDatesValue } from '../domain-workflows-filters-dates/domain-workflows-filters-dates.types';
import DomainWorkflowsFiltersStatus from '../domain-workflows-filters-status/domain-workflows-filters-status';
import { type DomainWorkflowsFiltersStatusValue } from '../domain-workflows-filters-status/domain-workflows-filters-status-types';

const domainWorkflowsFiltersConfig: [
  PageFilterConfig<
    typeof domainPageQueryParamsConfig,
    DomainWorkflowsFiltersStatusValue
  >,
  PageFilterConfig<
    typeof domainPageQueryParamsConfig,
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
