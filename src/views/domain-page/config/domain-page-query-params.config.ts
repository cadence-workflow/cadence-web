import { type PageQueryParam } from '@/hooks/use-page-query-params/use-page-query-params.types';
import parseDateQueryParam from '@/utils/datetime/parse-date-query-param';
import { type SortOrder } from '@/utils/sort-by';
import { WORKFLOW_CRON_LABELS } from '@/views/domain-workflows/domain-workflows-header/domain-workflows-header.constants';
import { type WorkflowCronValue } from '@/views/domain-workflows/domain-workflows-header/domain-workflows-header.types';
import { type WorkflowStatusClosed } from '@/views/domain-workflows-archival/domain-workflows-archival-header/domain-workflows-archival-header.types';
import { type WorkflowStatusBasicVisibility } from '@/views/domain-workflows-basic/domain-workflows-basic-filters/domain-workflows-basic-filters.types';
import isWorkflowStatusBasicVisibility from '@/views/domain-workflows-basic/domain-workflows-basic-filters/helpers/is-workflow-status-basic-visibility';
import isWorkflowStatus from '@/views/shared/workflow-status-tag/helpers/is-workflow-status';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';
import { type WorkflowsHeaderInputType } from '@/views/shared/workflows-header/workflows-header.types';

const domainPageQueryParamsConfig: [
  PageQueryParam<'inputType', WorkflowsHeaderInputType>,
  // Search input
  PageQueryParam<'search', string>,
  PageQueryParam<'status', WorkflowStatus | undefined>,
  PageQueryParam<'timeRangeStart', Date | undefined>,
  PageQueryParam<'timeRangeEnd', Date | undefined>,
  PageQueryParam<'sortColumn', string>,
  PageQueryParam<'sortOrder', SortOrder>,
  PageQueryParam<'cron', WorkflowCronValue | undefined>,
  // Query input
  PageQueryParam<'query', string>,
  // Basic Visibility inputs
  PageQueryParam<'workflowId', string>,
  PageQueryParam<'workflowType', string>,
  PageQueryParam<'statusBasic', WorkflowStatusBasicVisibility | undefined>,
  // Archival inputs
  PageQueryParam<'inputTypeArchival', WorkflowsHeaderInputType>,
  PageQueryParam<'searchArchival', string>,
  PageQueryParam<'statusArchival', WorkflowStatusClosed | undefined>,
  PageQueryParam<'timeRangeStartArchival', Date | undefined>,
  PageQueryParam<'timeRangeEndArchival', Date | undefined>,
  PageQueryParam<'sortColumnArchival', string>,
  PageQueryParam<'sortOrderArchival', SortOrder>,
  PageQueryParam<'queryArchival', string>,
  PageQueryParam<'cronArchival', WorkflowCronValue | undefined>,
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
    key: 'cron',
    parseValue: (value: string) =>
      value in WORKFLOW_CRON_LABELS ? (value as WorkflowCronValue) : undefined,
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
  {
    key: 'inputTypeArchival',
    queryParamKey: 'ainput',
    defaultValue: 'search',
    parseValue: (value: string) => (value === 'query' ? 'query' : 'search'),
  },
  {
    key: 'searchArchival',
    queryParamKey: 'asearch',
    defaultValue: '',
  },
  {
    key: 'statusArchival',
    queryParamKey: 'astatus',
    parseValue: (value: string) =>
      isWorkflowStatus(value) &&
      value !== 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID'
        ? value
        : undefined,
  },
  {
    key: 'timeRangeStartArchival',
    queryParamKey: 'astart',
    parseValue: parseDateQueryParam,
  },
  {
    key: 'timeRangeEndArchival',
    queryParamKey: 'aend',
    parseValue: parseDateQueryParam,
  },
  {
    key: 'sortColumnArchival',
    queryParamKey: 'acolumn',
    defaultValue: 'StartTime',
  },
  {
    key: 'sortOrderArchival',
    queryParamKey: 'aorder',
    defaultValue: 'DESC',
    parseValue: (value: string) => (value === 'ASC' ? 'ASC' : 'DESC'),
  },
  {
    key: 'queryArchival',
    queryParamKey: 'aquery',
    defaultValue: '',
  },
  {
    key: 'cronArchival',
    queryParamKey: 'acron',
    parseValue: (value: string) =>
      value in WORKFLOW_CRON_LABELS ? (value as WorkflowCronValue) : undefined,
  },
] as const;

export default domainPageQueryParamsConfig;
