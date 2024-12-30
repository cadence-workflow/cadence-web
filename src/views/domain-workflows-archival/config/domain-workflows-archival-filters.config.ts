import { createElement } from 'react';

import { type PageFilterConfig } from '@/components/page-filters/page-filters.types';
import type domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import DomainWorkflowsFiltersDates from '@/views/domain-workflows/domain-workflows-filters-dates/domain-workflows-filters-dates';
import DomainWorkflowsFiltersStatus from '@/views/domain-workflows/domain-workflows-filters-status/domain-workflows-filters-status';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

const domainWorkflowsArchivalFiltersConfig: [
  PageFilterConfig<
    typeof domainPageQueryParamsConfig,
    { statusArchival: WorkflowStatus | undefined }
  >,
  PageFilterConfig<
    typeof domainPageQueryParamsConfig,
    {
      timeRangeStartArchival: Date | undefined;
      timeRangeEndArchival: Date | undefined;
    }
  >,
] = [
  {
    id: 'status',
    getValue: (v) => v,
    formatValue: (v) => v,
    component: ({ value, setValue }) =>
      createElement(DomainWorkflowsFiltersStatus, {
        value: {
          status: value.statusArchival,
        },
        setValue: ({ status }) => {
          setValue({
            statusArchival: status,
          });
        },
      }),
  },
  {
    id: 'dates',
    getValue: (v) => v,
    formatValue: (v) => ({
      timeRangeStartArchival: v.timeRangeStartArchival?.toISOString(),
      timeRangeEndArchival: v.timeRangeEndArchival?.toISOString(),
    }),
    component: ({ value, setValue }) =>
      createElement(DomainWorkflowsFiltersDates, {
        value: {
          timeRangeStart: value.timeRangeStartArchival,
          timeRangeEnd: value.timeRangeEndArchival,
        },
        setValue: ({ timeRangeStart, timeRangeEnd }) => {
          setValue({
            timeRangeStartArchival: timeRangeStart,
            timeRangeEndArchival: timeRangeEnd,
          });
        },
      }),
  },
] as const;

export default domainWorkflowsArchivalFiltersConfig;
