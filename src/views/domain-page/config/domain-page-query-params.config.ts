import { type DateFilterValue } from '@/components/date-filter-v2/date-filter-v2.types';
import parseDateFilterValue from '@/components/date-filter-v2/helpers/parse-date-filter-value';
import {
  type PageQueryParamMultiValue,
  type PageQueryParam,
} from '@/hooks/use-page-query-params/use-page-query-params.types';
import { type SortOrder } from '@/utils/sort-by';
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
  PageQueryParamMultiValue<'statuses', Array<WorkflowStatus> | undefined>,
  PageQueryParam<'timeRangeStart', DateFilterValue | undefined>,
  PageQueryParam<'timeRangeEnd', DateFilterValue>,
  PageQueryParam<'sortColumn', string>,
  PageQueryParam<'sortOrder', SortOrder>,
  // Query input
  PageQueryParam<'query', string>,
  // Basic Visibility inputs
  PageQueryParam<'workflowId', string>,
  PageQueryParam<'workflowType', string>,
  PageQueryParam<'statusBasic', WorkflowStatusBasicVisibility | undefined>,
  PageQueryParam<'timeRangeStartBasic', DateFilterValue>,
  PageQueryParam<'timeRangeEndBasic', DateFilterValue>,
  // Archival inputs
  PageQueryParam<'inputTypeArchival', WorkflowsHeaderInputType>,
  PageQueryParam<'searchArchival', string>,
  PageQueryParamMultiValue<
    'statusesArchival',
    Array<WorkflowStatusClosed> | undefined
  >,
  PageQueryParam<'timeRangeStartArchival', DateFilterValue>,
  PageQueryParam<'timeRangeEndArchival', DateFilterValue>,
  PageQueryParam<'sortColumnArchival', string>,
  PageQueryParam<'sortOrderArchival', SortOrder>,
  PageQueryParam<'queryArchival', string>,
  // Failovers Tab query params
  PageQueryParam<'clusterAttributeScope', string | undefined>,
  PageQueryParam<'clusterAttributeValue', string | undefined>,
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
    key: 'statuses',
    queryParamKey: 'status',
    isMultiValue: true,
    parseValue: (value: Array<string>) =>
      value.every(isWorkflowStatus) ? value : undefined,
  },
  {
    key: 'timeRangeStart',
    queryParamKey: 'start',
    parseValue: parseDateFilterValue,
  },
  {
    key: 'timeRangeEnd',
    queryParamKey: 'end',
    defaultValue: 'now',
    parseValue: (v) => parseDateFilterValue(v) ?? 'now',
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
  {
    key: 'timeRangeStartBasic',
    queryParamKey: 'start',
    defaultValue: 'now-30d',
    parseValue: (v) => parseDateFilterValue(v) ?? 'now-30d',
  },
  {
    key: 'timeRangeEndBasic',
    queryParamKey: 'end',
    defaultValue: 'now',
    parseValue: (v) => parseDateFilterValue(v) ?? 'now',
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
    key: 'statusesArchival',
    queryParamKey: 'astatus',
    isMultiValue: true,
    parseValue: (value: Array<string>) =>
      value.every(
        (status) =>
          isWorkflowStatus(status) &&
          status !== 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID'
      )
        ? (value as Array<WorkflowStatusClosed>)
        : undefined,
  },
  {
    key: 'timeRangeStartArchival',
    queryParamKey: 'astart',
    defaultValue: 'now-7d',
    parseValue: (v) => parseDateFilterValue(v) ?? 'now-7d',
  },
  {
    key: 'timeRangeEndArchival',
    queryParamKey: 'aend',
    defaultValue: 'now',
    parseValue: (v) => parseDateFilterValue(v) ?? 'now',
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
    key: 'clusterAttributeScope',
    queryParamKey: 'cs',
  },
  {
    key: 'clusterAttributeValue',
    queryParamKey: 'cv',
  },
] as const;

export default domainPageQueryParamsConfig;
