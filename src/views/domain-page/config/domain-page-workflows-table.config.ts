import { createElement } from 'react';

import FormattedDate from '@/components/formatted-date/formatted-date';
import Link from '@/components/link/link';
import { type TableColumn } from '@/components/table/table.types';
import WorkflowStatusTag from '@/views/shared/workflow-status-tag/workflow-status-tag';

import { type DomainWorkflow } from '../domain-page.types';

const domainPageWorkflowsTableConfig: Array<TableColumn<DomainWorkflow>> = [
  {
    name: 'Workflow ID',
    id: 'WorkflowID',
    renderCell: (row: DomainWorkflow) =>
      createElement(
        Link,
        {
          href: `workflows/${encodeURIComponent(row.workflowID)}/${encodeURIComponent(row.runID)}`,
        },
        row.workflowID
      ),
    width: '27.5%',
  },
  {
    name: 'Status',
    id: 'CloseStatus',
    renderCell: (row: DomainWorkflow) =>
      createElement(WorkflowStatusTag, { status: row.status }),
    width: '7.5%',
  },
  {
    name: 'Run ID',
    id: 'RunID',
    renderCell: (row: DomainWorkflow) => row.runID,
    width: '20%',
  },
  {
    name: 'Workflow type',
    id: 'WorkflowType',
    renderCell: (row: DomainWorkflow) => row.workflowName,
    width: '20%',
  },
  {
    name: 'Started',
    id: 'StartTime',
    renderCell: (row: DomainWorkflow) =>
      createElement(FormattedDate, { timestampMs: row.startTime }),
    width: '12.5%',
    sortable: true,
  },
  {
    name: 'Ended',
    id: 'CloseTime',
    renderCell: (row: DomainWorkflow) =>
      createElement(FormattedDate, { timestampMs: row.closeTime }),
    width: '12.5%',
    sortable: true,
  },
];

export default domainPageWorkflowsTableConfig;
