import { createElement } from 'react';

import isNil from 'lodash/isNil';

import FormattedDate from '@/components/formatted-date/formatted-date';
import WorkflowStatusTag from '@/views/shared/workflow-status-tag/workflow-status-tag';

import getSearchAttributeValue from '../helpers/get-search-attribute-value';
import { type WorkflowsListColumnConfig } from '../workflows-list.types';

const workflowsListColumnsConfig: ReadonlyArray<WorkflowsListColumnConfig> = [
  {
    match: (name) => name === 'WorkflowID',
    name: 'Workflow ID',
    width: 'minmax(150px, 3fr)',
    renderCell: (row) => row.workflowID,
  },
  {
    match: (name) => name === 'CloseStatus',
    name: 'Status',
    width: '120px',
    renderCell: (row) =>
      createElement(WorkflowStatusTag, { status: row.status }),
  },
  {
    match: (name) => name === 'RunID',
    name: 'Run ID',
    width: 'minmax(150px, 3fr)',
    renderCell: (row) => row.runID,
  },
  {
    match: (name) => name === 'WorkflowType',
    name: 'Workflow Type',
    width: 'minmax(150px, 2fr)',
    renderCell: (row) => row.workflowName,
  },
  {
    match: (name) => name === 'StartTime',
    name: 'Started',
    width: 'minmax(100px, 200px)',
    sortable: true,
    renderCell: (row) =>
      createElement(FormattedDate, { timestampMs: row.startTime }),
  },
  {
    match: (name) => name === 'CloseTime',
    name: 'Ended',
    width: 'minmax(100px, 200px)',
    sortable: true,
    renderCell: (row) =>
      createElement(FormattedDate, { timestampMs: row.closeTime }),
  },
  {
    match: (name) => name === 'ExecutionTime',
    name: 'Started Execution',
    width: 'minmax(100px, 200px)',
    renderCell: (row) =>
      createElement(FormattedDate, { timestampMs: row.executionTime }),
  },
  {
    match: (name) => name === 'UpdateTime',
    name: 'Updated',
    width: 'minmax(100px, 200px)',
    renderCell: (row) =>
      createElement(FormattedDate, { timestampMs: row.updateTime }),
  },
  {
    match: (name) => name === 'HistoryLength',
    name: 'History Length',
    width: '120px',
    renderCell: (row) => row.historyLength ?? null,
  },
  {
    match: (name) => name === 'TaskList',
    name: 'Task List',
    width: 'minmax(100px, 2fr)',
    renderCell: (row) => row.taskList,
  },
  {
    match: (name) => name === 'IsCron',
    name: 'Is Cron',
    width: '80px',
    renderCell: (row) => (row.isCron ? 'Yes' : 'No'),
  },
  {
    match: (name) => name === 'ClusterAttributeScope',
    name: 'Cluster Attribute Scope',
    width: 'minmax(100px, 1.5fr)',
    renderCell: (row) => row.clusterAttributeScope ?? null,
  },
  {
    match: (name) => name === 'ClusterAttributeName',
    name: 'Cluster Attribute Name',
    width: 'minmax(100px, 1.5fr)',
    renderCell: (row) => row.clusterAttributeName ?? null,
  },
  {
    match: (_name, type) => type === 'INDEXED_VALUE_TYPE_DATETIME',
    width: 'minmax(100px, 200px)',
    renderCell: (row, attributeName) => {
      const value = getSearchAttributeValue(row, attributeName);
      const timestamp = typeof value === 'string' ? Date.parse(value) : null;

      if (timestamp !== null && !isNaN(timestamp)) {
        return createElement(FormattedDate, { timestampMs: timestamp });
      }

      return isNil(value) ? null : String(value);
    },
  },
];

export default workflowsListColumnsConfig;
