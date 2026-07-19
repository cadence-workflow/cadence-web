import { createElement } from 'react';

import Link from '@/components/link/link';
import { type TableConfig } from '@/components/table/table.types';
import { type WorkflowListItem } from '@/route-handlers/list-workflows/list-workflows.types';
import getSearchAttributeValue from '@/views/shared/workflows-list/helpers/get-search-attribute-value';

import ScheduleRunsRuntimeCell from '../schedule-runs-runtime-cell';

export default function getScheduleRunsTableConfig(
  domain: string,
  cluster: string
): TableConfig<WorkflowListItem> {
  return [
    {
      name: 'Run ID',
      id: 'RunID',
      renderCell: (row: WorkflowListItem) =>
        createElement(
          Link,
          {
            href: `/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows/${encodeURIComponent(row.workflowID)}/${encodeURIComponent(row.runID)}`,
          },
          row.runID
        ),
      width: '20%',
    },
    {
      name: 'Workflow ID',
      id: 'WorkflowID',
      renderCell: (row: WorkflowListItem) => row.workflowID,
      width: '20%',
    },
    {
      name: 'Backfill',
      id: 'CadenceScheduleIsBackfill',
      renderCell: (row: WorkflowListItem) =>
        String(
          getSearchAttributeValue(row, 'CadenceScheduleIsBackfill') ?? '-'
        ),
      width: '10%',
    },
    {
      name: 'Schedule time',
      id: 'CadenceScheduleTime',
      renderCell: (row: WorkflowListItem) =>
        String(getSearchAttributeValue(row, 'CadenceScheduleTime') ?? '-'),
      width: '17%',
    },
    {
      name: 'Run time (Start/Close)',
      id: 'RunTime',
      renderCell: ScheduleRunsRuntimeCell,
      width: '23%',
    },
    {
      name: 'Status',
      id: 'CloseStatus',
      renderCell: (row: WorkflowListItem) => row.status,
      width: '10%',
    },
  ];
}
