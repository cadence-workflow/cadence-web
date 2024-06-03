import { type PageQueryParam } from '@/hooks/use-page-query-params/use-page-query-params.types';
import { type SortingOrder } from '@/components/table/table.types';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';
import parseDateQueryParam from '../helpers/parse-date-query-param';

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
  },
] as const;

export default domainPageQueryParamsConfig;
