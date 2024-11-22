import { createElement } from 'react';

import FormattedDate from '@/components/formatted-date/formatted-date';
import { type TableConfig } from '@/components/table/table.types';
import { type Worker } from '@/route-handlers/describe-task-list/describe-task-list.types';

import TaskListWorkersTableHandlerIcon from '../task-list-workers-table-handler-icon/task-list-workers-table-handler-icon';

const taskListWorkersTableConfig = [
  {
    name: 'Identity',
    id: 'identity',
    renderCell: (row: Worker) => row.identity,
    width: '60%',
    sortable: true,
  },
  {
    name: 'Last Access Time',
    id: 'lastAccessTime',
    renderCell: (row: Worker) =>
      createElement(FormattedDate, { timestampMs: row.lastAccessTime }),
    width: '20%',
    sortable: true,
  },
  {
    name: 'Decision Handler',
    id: 'hasDecisionHandler',
    renderCell: (row: Worker) =>
      createElement(TaskListWorkersTableHandlerIcon, {
        hasHandler: row.hasDecisionHandler,
      }),
    width: '10%',
  },
  {
    name: 'Activity Handler',
    id: 'hasActivityHandler',
    renderCell: (row: Worker) =>
      createElement(TaskListWorkersTableHandlerIcon, {
        hasHandler: row.hasActivityHandler,
      }),
    width: '10%',
  },
] as const satisfies TableConfig<Worker>;

export default taskListWorkersTableConfig;
