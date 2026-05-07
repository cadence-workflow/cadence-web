import { type DomainWorkflow } from '@/views/domain-page/domain-page.types';

import {
  type WorkflowsListColumn,
  type WorkflowsListColumnConfig,
} from '../workflows-list.types';

export const mockWorkflowsListColumnsConfig: ReadonlyArray<WorkflowsListColumnConfig> =
  [
    {
      match: (name: string) => name === 'WorkflowID',
      name: 'Workflow ID',
      width: 'minmax(200px, 3fr)',
      renderCell: (row: DomainWorkflow, attributeName: string) =>
        `${attributeName}:${row.workflowID}`,
    },
    {
      match: (name: string) => name === 'CloseStatus',
      name: 'Status',
      width: 'minmax(100px, 1fr)',
      renderCell: (row: DomainWorkflow, attributeName: string) =>
        `${attributeName}:${row.workflowID}`,
    },
    {
      match: (_name: string, type: string) =>
        type === 'INDEXED_VALUE_TYPE_DATETIME',
      width: 'minmax(150px, 1.5fr)',
      renderCell: (row: DomainWorkflow, attributeName: string) =>
        `${attributeName}:${row.workflowID}`,
    },
  ];

export const mockWorkflowsListColumns: Array<WorkflowsListColumn> = [
  {
    id: 'WorkflowID',
    name: 'Workflow ID',
    width: 'minmax(200px, 3fr)',
    isSystem: true,
    renderCell: (row) => row.workflowID,
  },
  {
    id: 'Status',
    name: 'Status',
    width: 'minmax(100px, 1fr)',
    isSystem: true,
    renderCell: (row) => row.status,
  },
];

export const mockWorkflowsListSystemColumns: Array<WorkflowsListColumn> = [
  {
    id: 'WorkflowID',
    name: 'Workflow ID',
    width: '1fr',
    isSystem: true,
    renderCell: () => 'wf-id-cell',
  },
  {
    id: 'CloseStatus',
    name: 'Status',
    width: '1fr',
    isSystem: true,
    renderCell: () => 'status-cell',
  },
  {
    id: 'RunID',
    name: 'Run ID',
    width: '1fr',
    isSystem: true,
    renderCell: () => 'run-id-cell',
  },
  {
    id: 'WorkflowType',
    name: 'Workflow Type',
    width: '1fr',
    isSystem: true,
    renderCell: () => 'wf-type-cell',
  },
  {
    id: 'StartTime',
    name: 'Started',
    width: '1fr',
    isSystem: true,
    sortable: true,
    renderCell: () => 'start-time-cell',
  },
];
