import { type DomainWorkflow } from '@/views/domain-page/domain-page.types';

import {
  type WorkflowsListColumn,
  type WorkflowsListColumnMatcher,
} from '../workflows-list.types';

export const mockWorkflowsListColumnsConfig: ReadonlyArray<WorkflowsListColumnMatcher> =
  [
    {
      match: (name: string) => name === 'WorkflowID',
      name: 'Workflow ID',
      width: 'minmax(200px, 3fr)',
      isDefault: true,
      renderCell: (row: DomainWorkflow, attributeName: string) =>
        `${attributeName}:${row.workflowID}`,
    },
    {
      match: (name: string) => name === 'CloseStatus',
      name: 'Status',
      width: 'minmax(100px, 1fr)',
      isDefault: true,
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
    isDefault: true,
    renderCell: (row) => row.workflowID,
  },
  {
    id: 'Status',
    name: 'Status',
    width: 'minmax(100px, 1fr)',
    isDefault: true,
    renderCell: (row) => row.status,
  },
];
