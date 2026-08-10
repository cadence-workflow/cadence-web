import { createElement } from 'react';

import ListFilter from '@/components/list-filter/list-filter';
import { type PageFilterConfig } from '@/components/page-filters/page-filters.types';
import type domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';

import { DOMAIN_SCHEDULES_STATUS_LABELS_MAP } from '../domain-schedules.constants';
import type {
  DomainSchedulesFiltersStatusValue,
  DomainSchedulesStatus,
} from '../domain-schedules.types';

const domainSchedulesFiltersConfig: [
  PageFilterConfig<
    typeof domainPageQueryParamsConfig,
    DomainSchedulesFiltersStatusValue
  >,
] = [
  {
    id: 'status',
    getValue: (v) => ({ schedulesStatus: v.schedulesStatus }),
    formatValue: (v) => v,
    component: ({ value, setValue }) =>
      createElement(ListFilter<DomainSchedulesStatus>, {
        label: 'Status',
        placeholder: 'All statuses',
        value: value.schedulesStatus,
        onChangeValue: (v) => setValue({ schedulesStatus: v }),
        labelMap: DOMAIN_SCHEDULES_STATUS_LABELS_MAP,
      }),
  },
] as const;

export default domainSchedulesFiltersConfig;
