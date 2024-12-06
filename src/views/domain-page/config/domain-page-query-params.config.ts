import { type PageQueryParam } from '@/hooks/use-page-query-params/use-page-query-params.types';
import parseDateQueryParam from '@/utils/datetime/parse-date-query-param';
import { type SortOrder } from '@/utils/sort-by';
import { type DomainWorkflowsHeaderInputType } from '@/views/domain-workflows/domain-workflows-header/domain-workflows-header.types';
import { type WorkflowStatusBasicVisibility } from '@/views/domain-workflows-basic/domain-workflows-basic-filters-status/domain-workflows-basic-filters-status.types';
import isWorkflowStatusBasicVisibility from '@/views/domain-workflows-basic/domain-workflows-basic-filters-status/helpers/is-workflow-status-basic-visibility';
import isWorkflowStatus from '@/views/shared/workflow-status-tag/helpers/is-workflow-status';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

const domainPageQueryParamsConfig: [
  PageQueryParam<'inputType', DomainWorkflowsHeaderInputType>,
  // Search input
  PageQueryParam<'search', string>,
  PageQueryParam<'status', WorkflowStatus | undefined>,
  PageQueryParam<'timeRangeStart', Date | undefined>,
  PageQueryParam<'timeRangeEnd', Date | undefined>,
  PageQueryParam<'sortColumn', string>,
  PageQueryParam<'sortOrder', SortOrder>,
  // Query input
  PageQueryParam<'query', string>,
  // Basic Visibility inputs
  PageQueryParam<'workflowId', string>,
  PageQueryParam<'workflowType', string>,
  PageQueryParam<'statusBasic', WorkflowStatusBasicVisibility | undefined>,
] = [
  {
    key: 'inputType',
    queryParamKey: 'input',
    defaultValue: 'search',
    parseValue: (value: string) => (value === 'query' ? 'query' : 'search'),
  },
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
  {
    key: 'query',
    defaultValue: '',
  },
  {
    key: 'workflowId',
    defaultValue: '',
  },
  {
    key: 'workflowType',
    defaultValue: '',
  },
  {
    key: 'statusBasic',
    queryParamKey: 'status',
    parseValue: (value: string) =>
      isWorkflowStatusBasicVisibility(value) ? value : undefined,
  },
] as const;

export default domainPageQueryParamsConfig;
