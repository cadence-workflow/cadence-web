import React from 'react';

import formatDate from '@/utils/data-formatters/format-date';
import formatTimeDiff from '@/utils/datetime/format-time-diff';

import BatchActionEditableValue from './batch-action-editable-value/batch-action-editable-value';
import { type BatchActionHeaderInfoItemsConfig } from './batch-action-header-info.types';
import BatchActionStatusBadge from './batch-action-status-badge/batch-action-status-badge';

const batchActionHeaderInfoItemsConfig = [
  {
    title: 'Status',
    render: ({ batchAction }) => (
      <BatchActionStatusBadge status={batchAction.status} />
    ),
    placeholderSize: '100px',
  },
  {
    title: 'Action',
    render: ({ batchAction }) => {
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
    render: ({ batchAction }) =>
      batchAction.startTime ? formatDate(batchAction.startTime) : '—',
    placeholderSize: '180px',
  },
  {
    title: 'Ended',
    hidden: ({ batchAction }) => batchAction.status === 'running',
    render: ({ batchAction }) =>
      batchAction.endTime ? formatDate(batchAction.endTime) : '—',
    placeholderSize: '180px',
  },
  {
    title: 'Duration',
    render: ({ batchAction }) =>
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
    render: ({ batchAction }) => (
      <BatchActionEditableValue
        value={batchAction.rps}
        editable={batchAction.status === 'running'}
      />
    ),
    placeholderSize: '80px',
  },
  {
    title: 'Concurrency',
    render: ({ batchAction }) => (
      <BatchActionEditableValue
        value={batchAction.concurrency}
        editable={batchAction.status === 'running'}
      />
    ),
    placeholderSize: '80px',
  },
] as const satisfies BatchActionHeaderInfoItemsConfig;

export default batchActionHeaderInfoItemsConfig;
