import { createElement } from 'react';

import FormattedDate from '@/components/formatted-date/formatted-date';
import formatPayload from '@/utils/data-formatters/format-payload';
import WorkflowStatusTag from '@/views/shared/workflow-status-tag/workflow-status-tag';

import { type WorkflowsListColumnMatcher } from '../workflows-list.types';

/**
 * Matchers for the workflows list columns.
 * Each search attribute from the API is matched against these in order — first match wins.
 * Unmatched custom attributes fall back to String() rendering.
 * Unmatched system attributes are excluded from the list.
 */
const workflowsListColumnMatchers: ReadonlyArray<WorkflowsListColumnMatcher> = [
  {
    match: (name) => name === 'WorkflowID',
    name: 'Workflow ID',
    width: 'minmax(200px, 3fr)',
    isDefault: true,
    renderCell: (row) => row.workflowID,
  },
  {
    match: (name) => name === 'CloseStatus',
    name: 'Status',
    width: 'minmax(100px, 1fr)',
    isDefault: true,
    renderCell: (row) =>
      createElement(WorkflowStatusTag, { status: row.status }),
  },
  {
    match: (name) => name === 'RunID',
    name: 'Run ID',
    width: 'minmax(200px, 3fr)',
    isDefault: true,
    renderCell: (row) => row.runID,
  },
  {
    match: (name) => name === 'WorkflowType',
    name: 'Workflow Type',
    width: '2fr',
    isDefault: true,
    renderCell: (row) => row.workflowName,
  },
  {
    match: (name) => name === 'StartTime',
    name: 'Started',
    width: 'minmax(150px, 1.5fr)',
    isDefault: true,
    renderCell: (row) =>
      createElement(FormattedDate, { timestampMs: row.startTime }),
  },
  {
    match: (name) => name === 'CloseTime',
    name: 'Ended',
    width: 'minmax(150px, 1.5fr)',
    isDefault: true,
    renderCell: (row) =>
      createElement(FormattedDate, { timestampMs: row.closeTime }),
  },
  {
    match: (_name, type) => type === 'DATETIME',
    width: 'minmax(150px, 1.5fr)',
    renderCell: (row, attributeName) => {
      const value = formatPayload(row.searchAttributes?.[attributeName]);
      const timestamp = typeof value === 'string' ? Date.parse(value) : null;
      if (timestamp && !isNaN(timestamp)) {
        return createElement(FormattedDate, { timestampMs: timestamp });
      }
      return String(value ?? '');
    },
  },
];

export default workflowsListColumnMatchers;
