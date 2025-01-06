import { createElement } from 'react';

import { omit } from 'lodash';

import DatePicker from '@/components/date-picker/date-picker';
import ListPicker from '@/components/list-picker/list-picker';
import { type PageFilterConfig } from '@/components/page-filters/page-filters.types';
import type domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import { WORKFLOW_STATUS_NAMES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';

import { type WorkflowStatusClosed } from '../domain-workflows-archival-header/domain-workflows-archival-header.types';

const domainWorkflowsArchivalFiltersConfig: [
  PageFilterConfig<
    typeof domainPageQueryParamsConfig,
    { statusArchival: WorkflowStatusClosed | undefined }
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
      createElement(ListPicker<WorkflowStatusClosed>, {
        label: 'Status',
        placeholder: 'Show all statuses',
        value: value.statusArchival,
        setValue: (v) => setValue({ statusArchival: v }),
        labelMap: omit(
          WORKFLOW_STATUS_NAMES,
          'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID'
        ),
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
      createElement(DatePicker, {
        label: 'Dates',
        placeholder: 'Select time range',
        dates: {
          start: value.timeRangeStartArchival,
          end: value.timeRangeEndArchival,
        },
        setDates: ({ start, end }) =>
          setValue({
            timeRangeStartArchival: start,
            timeRangeEndArchival: end,
          }),
        clearable: false,
      }),
  },
] as const;

export default domainWorkflowsArchivalFiltersConfig;
