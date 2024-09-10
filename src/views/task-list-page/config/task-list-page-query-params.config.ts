import { TaskListType } from '@/__generated__/proto-ts/uber/cadence/api/v1/TaskListType';
import { type PageQueryParam } from '@/hooks/use-page-query-params/use-page-query-params.types';

const taskListPageQueryParamsConfig: [
  PageQueryParam<'taskListSearch', string>,
  PageQueryParam<'handlerType', TaskListType | undefined>,
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
] as const;

export default taskListPageQueryParamsConfig;
