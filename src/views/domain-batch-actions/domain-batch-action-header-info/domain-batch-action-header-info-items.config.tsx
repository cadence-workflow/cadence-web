import React from 'react';

import formatDate from '@/utils/data-formatters/format-date';
import formatTimeDiff from '@/utils/datetime/format-time-diff';

import DomainBatchActionEditableValue from '../domain-batch-action-editable-value/domain-batch-action-editable-value';
import DomainBatchActionStatusBadge from '../domain-batch-action-status-badge/domain-batch-action-status-badge';

import { type DomainBatchActionHeaderInfoItemsConfig } from './domain-batch-action-header-info.types';

const batchActionHeaderInfoItemsConfig = [
  {
    title: 'Status',
    render: ({ batchAction }) => (
      <DomainBatchActionStatusBadge status={batchAction.status} />
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
      <DomainBatchActionEditableValue
        value={batchAction.rps}
        editable={batchAction.status === 'running'}
      />
    ),
    placeholderSize: '80px',
  },
  {
    title: 'Concurrency',
    render: ({ batchAction }) => (
      <DomainBatchActionEditableValue
        value={batchAction.concurrency}
        editable={batchAction.status === 'running'}
      />
    ),
    placeholderSize: '80px',
  },
] as const satisfies DomainBatchActionHeaderInfoItemsConfig;

export default batchActionHeaderInfoItemsConfig;
