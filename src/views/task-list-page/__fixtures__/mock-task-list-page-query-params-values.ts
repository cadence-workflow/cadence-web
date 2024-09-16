import { type PageQueryParamValues } from '@/hooks/use-page-query-params/use-page-query-params.types';

import type taskListPageQueryParamsConfig from '../config/task-list-page-query-params.config';

export const mockTaskListPageQueryParamsValues: PageQueryParamValues<
  typeof taskListPageQueryParamsConfig
> = {
  taskListSearch: '',
  handlerType: undefined,
  sortColumn: 'lastAccessTime',
  sortOrder: 'DESC',
};
