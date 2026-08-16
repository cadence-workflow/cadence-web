import { createElement } from 'react';

import { Spinner } from 'baseui/icon';
import { MdCancel, MdCheckCircle, MdReport } from 'react-icons/md';

import { type TagFilterOptionConfig } from '@/components/tag-filter/tag-filter.types';
import { type HistoryEventFilterStatus } from '@/views/workflow-history/workflow-history-filters-status/workflow-history-filters-status.types';

const workflowHistoryFiltersStatusOptionsConfig = {
  PENDING: {
    label: 'Pending',
    startEnhancer: ({ theme }) =>
      createElement(Spinner, { color: theme.colors.contentAccent }),
  },
  CANCELED: {
    label: 'Canceled',
    startEnhancer: ({ theme }) =>
      createElement(MdCancel, { color: theme.colors.backgroundWarning }),
  },
  FAILED: {
    label: 'Failed',
    startEnhancer: ({ theme }) =>
      createElement(MdReport, { color: theme.colors.contentNegative }),
  },
  COMPLETED: {
    label: 'Completed',
    startEnhancer: ({ theme }) =>
      createElement(MdCheckCircle, { color: theme.colors.contentPositive }),
  },
} as const satisfies Record<HistoryEventFilterStatus, TagFilterOptionConfig>;

export default workflowHistoryFiltersStatusOptionsConfig;
