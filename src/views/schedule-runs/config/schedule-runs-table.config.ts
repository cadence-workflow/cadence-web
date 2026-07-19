import { createElement } from 'react';

import Link from '@/components/link/link';
import { type TableConfig } from '@/components/table/table.types';
import formatPayload from '@/utils/data-formatters/format-payload';
import WorkflowStatusTag from '@/views/shared/workflow-status-tag/workflow-status-tag';

import ScheduleRunsRuntimeCell from '../schedule-runs-runtime-cell/schedule-runs-runtime-cell';
import { type ScheduleRunsTableRow } from '../schedule-runs-table/schedule-runs-table.types';

const scheduleRunsTableConfig = [
  {
    name: 'Workflow ID',
    id: 'WorkflowID',
    renderCell: (row: ScheduleRunsTableRow) => row.workflowID,
    width: '20%',
  },
  {
    name: 'Status',
    id: 'CloseStatus',
    renderCell: (row: ScheduleRunsTableRow) =>
      createElement(WorkflowStatusTag, { status: row.status }),
    width: '10%',
  },
  {
    name: 'Run ID',
    id: 'RunID',
    renderCell: (row: ScheduleRunsTableRow) =>
      createElement(
        Link,
        {
          href: `/domains/${encodeURIComponent(row.domain)}/${encodeURIComponent(row.cluster)}/workflows/${encodeURIComponent(row.workflowID)}/${encodeURIComponent(row.runID)}`,
        },
        row.runID
      ),
    width: '20%',
  },
  {
    name: 'Backfill',
    id: 'CadenceScheduleIsBackfill',
    renderCell: (row: ScheduleRunsTableRow) =>
      String(
        formatPayload(row.searchAttributes?.['CadenceScheduleIsBackfill']) ??
          '-'
      ),
    width: '9%',
  },
  {
    name: 'Schedule time',
    id: 'CadenceScheduleTime',
    renderCell: (row: ScheduleRunsTableRow) =>
      String(
        formatPayload(row.searchAttributes?.['CadenceScheduleTime']) ?? '-'
      ),
    width: '17%',
  },
  {
    name: 'Run time (Start/Close)',
    id: 'RunTime',
    renderCell: ScheduleRunsRuntimeCell,
    width: '24%',
  },
] as const satisfies TableConfig<ScheduleRunsTableRow>;

export default scheduleRunsTableConfig;
