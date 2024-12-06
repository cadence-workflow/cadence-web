import { type PageFilterConfig } from '@/components/page-filters/page-filters.types';
import type domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import DomainWorkflowsFiltersDates from '@/views/domain-workflows/domain-workflows-filters-dates/domain-workflows-filters-dates';
import { type DomainWorkflowsFiltersDatesValue } from '@/views/domain-workflows/domain-workflows-filters-dates/domain-workflows-filters-dates.types';

import DomainWorkflowsBasicFiltersStatus from '../domain-workflows-basic-filters-status/domain-workflows-basic-filters-status';
import { type DomainWorkflowsBasicFiltersStatusValue } from '../domain-workflows-basic-filters-status/domain-workflows-basic-filters-status.types';

const domainWorkflowsBasicFiltersConfig: [
  PageFilterConfig<
    typeof domainPageQueryParamsConfig,
    DomainWorkflowsBasicFiltersStatusValue
  >,
  PageFilterConfig<
    typeof domainPageQueryParamsConfig,
    DomainWorkflowsFiltersDatesValue
  >,
] = [
  {
    id: 'status',
    getValue: (v) => ({ statusBasic: v.statusBasic }),
    formatValue: (v) => v,
    component: DomainWorkflowsBasicFiltersStatus,
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

export default domainWorkflowsBasicFiltersConfig;
