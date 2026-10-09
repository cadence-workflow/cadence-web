import { createElement } from 'react';

import Link from '@/components/link/link';
import { type TableColumn } from '@/components/table/table.types';
import { type ScheduleListEntry } from '@/route-handlers/list-schedules/list-schedules.types';
import ScheduleCronExpression from '@/views/shared/schedule-cron-expression/schedule-cron-expression';
import ScheduleStatusTag from '@/views/shared/schedule-status-tag/schedule-status-tag';

import { TABLE_CELL_PLACEHOLDER_TEXT } from '../domain-schedules.constants';

const schedulesTableConfig = [
  {
    name: 'Schedule ID',
    id: 'ScheduleId',
    renderCell: (row: ScheduleListEntry) =>
      createElement(
        Link,
        {
          href: `schedules/${encodeURIComponent(row.scheduleId)}`,
        },
        row.scheduleId
      ),
    width: '25%',
  },
  {
    name: 'Status',
    id: 'Status',
    renderCell: (row: ScheduleListEntry) =>
      createElement(ScheduleStatusTag, {
        paused: Boolean(row.state?.paused),
      }),
    width: '15%',
  },
  {
    name: 'Workflow Type',
    id: 'WorkflowType',
    renderCell: (row: ScheduleListEntry) =>
      row.workflowType?.name || TABLE_CELL_PLACEHOLDER_TEXT,
    width: '25%',
  },
  {
    name: 'Cron expression',
    id: 'CronExpression',
    renderCell: (row: ScheduleListEntry) =>
      row.cronExpression
        ? createElement(ScheduleCronExpression, {
            cronExpression: row.cronExpression,
          })
        : TABLE_CELL_PLACEHOLDER_TEXT,
    width: '35%',
  },
] as const satisfies Array<Omit<TableColumn<ScheduleListEntry>, 'sortable'>>;

export default schedulesTableConfig;
