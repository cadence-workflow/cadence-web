import { createElement } from 'react';

import FormattedDate from '@/components/formatted-date/formatted-date';
import Link from '@/components/link/link';
import { type DomainWorkflow } from '@/views/domain-page/domain-page.types';
import WorkflowStatusTag from '@/views/shared/workflow-status-tag/workflow-status-tag';

import { type CronListTableConfig } from '../cron-list-table.types';

const cronListTableConfig = [
  {
    name: 'Workflow ID',
    id: 'WorkflowID',
    renderCell: (row: DomainWorkflow) => row.workflowID,
    width: '25.5%',
  },
  {
    name: 'Workflow type',
    id: 'WorkflowType',
    renderCell: (row: DomainWorkflow) => row.workflowName,
    width: '20%',
  },
  {
    name: 'Cron (UTC)',
    id: 'CronSchedule',
    renderCell: (row: DomainWorkflow) => 'Coming soon',
    width: '10%',
  },
  {
    name: 'Status',
    id: 'CloseStatus',
    renderCell: (row: DomainWorkflow) =>
      createElement(WorkflowStatusTag, { status: row.status }),
    width: '7.5%',
  },
  {
    name: 'Started',
    id: 'StartTime',
    renderCell: (row: DomainWorkflow) =>
      createElement(FormattedDate, { timestampMs: row.startTime }),
    width: '12.5%',
  },
] as const satisfies CronListTableConfig;

export default cronListTableConfig;
