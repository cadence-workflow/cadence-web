import DomainPageWorkflowsFiltersDates from '../domain-page-workflows-filters-dates/domain-page-workflows-filters-dates';
import DomainPageWorkflowsFiltersStatus from '../domain-page-workflows-filters-status/domain-page-workflows-filters-status';
import { type DomainPageWorkflowsFiltersConfig } from '../domain-page-workflows-filters/domain-page-workflows-filters.types';

const domainPageWorkflowsFiltersConfig = [
  {
    id: 'status',
    queryParamKeys: ['status'],
    component: DomainPageWorkflowsFiltersStatus,
  },
  {
    id: 'dates',
    queryParamKeys: ['startDate', 'endDate'],
    component: DomainPageWorkflowsFiltersDates,
  },
] as const satisfies DomainPageWorkflowsFiltersConfig;

export default domainPageWorkflowsFiltersConfig;
