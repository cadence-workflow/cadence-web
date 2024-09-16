import { TaskListType } from '@/__generated__/proto-ts/uber/cadence/api/v1/TaskListType';
import { type PageQueryParam } from '@/hooks/use-page-query-params/use-page-query-params.types';
import { type SortOrder } from '@/utils/sort-by';

import isValidTableColumn from '../helpers/is-valid-table-column';
import { type TaskListWorkerTableColumnID } from '../task-list-workers-table/task-list-workers-table.types';

const taskListPageQueryParamsConfig: [
  PageQueryParam<'taskListSearch', string>,
  PageQueryParam<'handlerType', TaskListType | undefined>,
  PageQueryParam<'sortColumn', TaskListWorkerTableColumnID>,
  PageQueryParam<'sortOrder', SortOrder>,
] = [
  {
    key: 'taskListSearch',
    queryParamKey: 'ts',
    defaultValue: '',
  },
  {
    key: 'handlerType',
    queryParamKey: 'th',
    parseValue: (value: string) =>
      value in TaskListType ? (value as TaskListType) : undefined,
  },
  {
    key: 'sortColumn',
    queryParamKey: 'tsc',
    defaultValue: 'lastAccessTime',
    parseValue: (value: string) =>
      isValidTableColumn(value) ? value : 'lastAccessTime',
  },
  {
    key: 'sortOrder',
    queryParamKey: 'tso',
    defaultValue: 'DESC',
    parseValue: (value: string) => (value === 'ASC' ? 'ASC' : 'DESC'),
  },
] as const;

export default taskListPageQueryParamsConfig;
