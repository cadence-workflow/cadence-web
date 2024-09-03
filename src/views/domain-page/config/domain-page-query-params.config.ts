import { type PageQueryParam } from '@/hooks/use-page-query-params/use-page-query-params.types';
import parseDateQueryParam from '@/utils/datetime/parse-date-query-param';
import { type SortOrder } from '@/utils/sort-by';
import isWorkflowStatus from '@/views/shared/workflow-status-tag/helpers/is-workflow-status';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

const domainPageQueryParamsConfig: [
  // Workflows
  PageQueryParam<'search', string>,
  PageQueryParam<'status', WorkflowStatus | undefined>,
  PageQueryParam<'timeRangeStart', Date | undefined>,
  PageQueryParam<'timeRangeEnd', Date | undefined>,
  PageQueryParam<'sortColumn', string>,
  PageQueryParam<'sortOrder', SortOrder>,
  // Task Lists
] = [
  {
    key: 'search',
    defaultValue: '',
  },
  {
    key: 'status',
    parseValue: (value: string) =>
      isWorkflowStatus(value) ? value : undefined,
  },
  {
    key: 'timeRangeStart',
    queryParamKey: 'start',
    parseValue: parseDateQueryParam,
  },
  {
    key: 'timeRangeEnd',
    queryParamKey: 'end',
    parseValue: parseDateQueryParam,
  },
  {
    key: 'sortColumn',
    queryParamKey: 'column',
    defaultValue: 'StartTime',
  },
  {
    key: 'sortOrder',
    queryParamKey: 'order',
    defaultValue: 'DESC',
    parseValue: (value: string) => (value === 'ASC' ? 'ASC' : 'DESC'),
  },
] as const;

export default domainPageQueryParamsConfig;
