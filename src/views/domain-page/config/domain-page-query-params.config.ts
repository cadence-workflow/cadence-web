import { type PageQueryParam } from '@/hooks/use-page-query-params/use-page-query-params.types';
import { type SortingOrder } from '@/components/table/table.types';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';
import parseDateQueryParam from '../helpers/parse-date-query-param';
import { WORKFLOW_STATUS_NAMES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';
import isWorkflowStatus from '@/views/shared/workflow-status-tag/helpers/is-workflow-status';

const domainPageQueryParamsConfig: [
  PageQueryParam<'search', string>,
  PageQueryParam<'status', WorkflowStatus | undefined>,
  PageQueryParam<'startDate', Date | undefined>,
  PageQueryParam<'endDate', Date | undefined>,
  PageQueryParam<'sortColumn', string>,
  PageQueryParam<'sortOrder', SortingOrder>,
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
    key: 'startDate',
    queryParamKey: 'start',
    parseValue: parseDateQueryParam,
  },
  {
    key: 'endDate',
    queryParamKey: 'end',
    parseValue: parseDateQueryParam,
  },
  {
    key: 'sortColumn',
    queryParamKey: 'column',
    defaultValue: 'startTime',
  },
  {
    key: 'sortOrder',
    queryParamKey: 'order',
    defaultValue: 'DESC',
    parseValue: (value: string) => (value === 'ASC' ? 'ASC' : 'DESC'),
  },
] as const;

export default domainPageQueryParamsConfig;
