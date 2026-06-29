import { createElement } from 'react';

import formatDate from '@/utils/data-formatters/format-date';
import formatTimeDiff from '@/utils/datetime/format-time-diff';

import { type DomainBatchActionHeaderInfoItemsConfig } from '../domain-batch-actions-header-info/domain-batch-actions-header-info.types';
import DomainBatchActionRpsValue from '../domain-batch-actions-rps-value/domain-batch-actions-rps-value';
import DomainBatchActionStatusBadge from '../domain-batch-actions-status-badge/domain-batch-actions-status-badge';

const batchActionHeaderInfoItemsConfig = [
  {
    title: 'Status',
    render: ({ batchAction }) =>
      createElement(DomainBatchActionStatusBadge, {
        status: batchAction.status,
      }),
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
    hidden: ({ batchAction }) => batchAction.status === 'RUNNING',
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
            batchAction.status === 'RUNNING'
              ? null
              : batchAction.endTime ?? null,
            true
          )
        : '—',
    placeholderSize: '80px',
  },
  {
    title: 'RPS',
    render: ({ batchAction, domain, cluster, workflowId }) =>
      createElement(DomainBatchActionRpsValue, {
        domain,
        cluster,
        workflowId,
        batchAction,
      }),
    placeholderSize: '80px',
  },
] as const satisfies DomainBatchActionHeaderInfoItemsConfig;

export default batchActionHeaderInfoItemsConfig;
