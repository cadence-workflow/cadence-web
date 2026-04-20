import React from 'react';

import formatDate from '@/utils/data-formatters/format-date';
import formatTimeDiff from '@/utils/datetime/format-time-diff';

import BatchActionEditableValue from './batch-action-editable-value/batch-action-editable-value';
import {
  type BatchActionHeaderInfoItemProps,
  type BatchActionHeaderInfoItemsConfig,
} from './batch-action-header-info.types';
import BatchActionStatusBadge from './batch-action-status-badge/batch-action-status-badge';

const batchActionHeaderInfoItemsConfig = [
  {
    title: 'Status',
    component: ({ batchAction }: BatchActionHeaderInfoItemProps) => (
      <BatchActionStatusBadge status={batchAction.status} />
    ),
    placeholderSize: '100px',
  },
  {
    title: 'Action',
    getLabel: ({ batchAction }: BatchActionHeaderInfoItemProps) => {
      if (!batchAction.actionType) return '—';
      return (
        batchAction.actionType.charAt(0).toUpperCase() +
        batchAction.actionType.slice(1)
      );
    },
    placeholderSize: '64px',
  },
  {
    title: 'Started',
    getLabel: ({ batchAction }: BatchActionHeaderInfoItemProps) =>
      batchAction.startTime ? formatDate(batchAction.startTime) : '—',
    placeholderSize: '180px',
  },
  {
    title: 'Ended',
    hidden: ({ batchAction }: BatchActionHeaderInfoItemProps) =>
      batchAction.status === 'running',
    getLabel: ({ batchAction }: BatchActionHeaderInfoItemProps) =>
      batchAction.endTime ? formatDate(batchAction.endTime) : '—',
    placeholderSize: '180px',
  },
  {
    title: 'Duration',
    getLabel: ({ batchAction }: BatchActionHeaderInfoItemProps) =>
      batchAction.startTime
        ? formatTimeDiff(
            batchAction.startTime,
            batchAction.status === 'running'
              ? null
              : batchAction.endTime ?? null,
            true
          )
        : '—',
    placeholderSize: '80px',
  },
  {
    title: 'RPS',
    component: ({ batchAction }: BatchActionHeaderInfoItemProps) => (
      <BatchActionEditableValue
        value={batchAction.rps}
        editable={batchAction.status === 'running'}
      />
    ),
    placeholderSize: '80px',
  },
  {
    title: 'Concurrency',
    component: ({ batchAction }: BatchActionHeaderInfoItemProps) => (
      <BatchActionEditableValue
        value={batchAction.concurrency}
        editable={batchAction.status === 'running'}
      />
    ),
    placeholderSize: '80px',
  },
] as const satisfies BatchActionHeaderInfoItemsConfig;

export default batchActionHeaderInfoItemsConfig;
