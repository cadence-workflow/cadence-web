import { createElement } from 'react';

import FormattedDate from '@/components/formatted-date/formatted-date';
import formatPayload from '@/utils/data-formatters/format-payload';
import WorkflowStatusTag from '@/views/shared/workflow-status-tag/workflow-status-tag';

import { type WorkflowsListColumnMatcher } from '../workflows-list.types';

const workflowsListColumns: ReadonlyArray<WorkflowsListColumnMatcher> = [
  {
    match: (name) => name === 'WorkflowID',
    name: 'Workflow ID',
    width: 'minmax(300px, 3fr)',
    isDefault: true,
    renderCell: (row) => row.workflowID,
  },
  {
    match: (name) => name === 'CloseStatus',
    name: 'Status',
    width: '140px',
    isDefault: true,
    renderCell: (row) =>
      createElement(WorkflowStatusTag, { status: row.status }),
  },
  {
    match: (name) => name === 'RunID',
    name: 'Run ID',
    width: 'minmax(300px, 3fr)',
    isDefault: true,
    renderCell: (row) => row.runID,
  },
  {
    match: (name) => name === 'WorkflowType',
    name: 'Workflow Type',
    width: 'minmax(200px, 2fr)',
    isDefault: true,
    renderCell: (row) => row.workflowName,
  },
  {
    match: (name) => name === 'StartTime',
    name: 'Started',
    width: '200px',
    isDefault: true,
    renderCell: (row) =>
      createElement(FormattedDate, { timestampMs: row.startTime }),
  },
  {
    match: (name) => name === 'CloseTime',
    name: 'Ended',
    width: '200px',
    isDefault: true,
    renderCell: (row) =>
      createElement(FormattedDate, { timestampMs: row.closeTime }),
  },
  {
    match: (name) => name === 'ExecutionTime',
    name: 'Started Execution',
    width: '200px',
    renderCell: (row) =>
      createElement(FormattedDate, { timestampMs: row.executionTime }),
  },
  {
    match: (name) => name === 'UpdateTime',
    name: 'Updated',
    width: '200px',
    renderCell: (row) =>
      createElement(FormattedDate, { timestampMs: row.updateTime }),
  },
  {
    match: (name) => name === 'HistoryLength',
    name: 'History Length',
    width: '140px',
    renderCell: (row) => String(row.historyLength ?? ''),
  },
  {
    match: (name) => name === 'TaskList',
    name: 'Task List',
    width: 'minmax(200px, 2fr)',
    renderCell: (row) => row.taskList,
  },
  {
    match: (name) => name === 'IsCron',
    name: 'Is Cron',
    width: '100px',
    renderCell: (row) => (row.isCron ? 'Yes' : 'No'),
  },
  {
    match: (name) => name === 'ClusterAttributeScope',
    name: 'Cluster Attribute Scope',
    width: '160px',
    renderCell: (row) => row.clusterAttributeScope ?? '',
  },
  {
    match: (name) => name === 'ClusterAttributeName',
    name: 'Cluster Attribute Name',
    width: '160px',
    renderCell: (row) => row.clusterAttributeName ?? '',
  },
  {
    match: (_name, type) => type === 'INDEXED_VALUE_TYPE_DATETIME',
    width: '200px',
    renderCell: (row, attributeName) => {
      const value = formatPayload(row.searchAttributes?.[attributeName]);
      const timestamp = typeof value === 'string' ? Date.parse(value) : null;
      if (timestamp != null && !isNaN(timestamp)) {
        return createElement(FormattedDate, { timestampMs: timestamp });
      }
      return String(value ?? '');
    },
  },
];

export default workflowsListColumns;
