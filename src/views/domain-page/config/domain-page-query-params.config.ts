import {
  type PageQueryParamMultiValue,
  type PageQueryParam,
} from '@/hooks/use-page-query-params/use-page-query-params.types';
import dayjs from '@/utils/datetime/dayjs';
import parseDateQueryParam from '@/utils/datetime/parse-date-query-param';
import { type SortOrder } from '@/utils/sort-by';
import DOMAIN_WORKFLOWS_ARCHIVAL_START_DAYS_CONFIG from '@/views/domain-workflows-archival/config/domain-workflows-archival-start-days.config';
import { type WorkflowStatusClosed } from '@/views/domain-workflows-archival/domain-workflows-archival-header/domain-workflows-archival-header.types';
import DOMAIN_WORKFLOWS_BASIC_START_DAYS_CONFIG from '@/views/domain-workflows-basic/config/domain-workflows-basic-start-days.config';
import { type WorkflowStatusBasicVisibility } from '@/views/domain-workflows-basic/domain-workflows-basic-filters/domain-workflows-basic-filters.types';
import isWorkflowStatusBasicVisibility from '@/views/domain-workflows-basic/domain-workflows-basic-filters/helpers/is-workflow-status-basic-visibility';
import isWorkflowStatus from '@/views/shared/workflow-status-tag/helpers/is-workflow-status';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';
import { type WorkflowsHeaderInputType } from '@/views/shared/workflows-header/workflows-header.types';

const now = dayjs();

const domainPageQueryParamsConfig: [
  PageQueryParam<'inputType', WorkflowsHeaderInputType>,
  // Search input
  PageQueryParam<'search', string>,
  PageQueryParamMultiValue<'statuses', Array<WorkflowStatus> | undefined>,
  PageQueryParam<'timeRangeStart', Date | undefined>,
  PageQueryParam<'timeRangeEnd', Date>,
  PageQueryParam<'sortColumn', string>,
  PageQueryParam<'sortOrder', SortOrder>,
  // Query input
  PageQueryParam<'query', string>,
  // Basic Visibility inputs
  PageQueryParam<'workflowId', string>,
  PageQueryParam<'workflowType', string>,
  PageQueryParam<'statusBasic', WorkflowStatusBasicVisibility | undefined>,
  PageQueryParam<'timeRangeStartBasic', Date>,
  PageQueryParam<'timeRangeEndBasic', Date>,
  // Archival inputs
  PageQueryParam<'inputTypeArchival', WorkflowsHeaderInputType>,
  PageQueryParam<'searchArchival', string>,
  PageQueryParamMultiValue<
    'statusesArchival',
    Array<WorkflowStatusClosed> | undefined
  >,
  PageQueryParam<'timeRangeStartArchival', Date>,
  PageQueryParam<'timeRangeEndArchival', Date>,
  PageQueryParam<'sortColumnArchival', string>,
  PageQueryParam<'sortOrderArchival', SortOrder>,
  PageQueryParam<'queryArchival', string>,
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
    parseValue: parseDateQueryParam,
  },
  {
    key: 'timeRangeEnd',
    queryParamKey: 'end',
    defaultValue: now.toDate(),
    parseValue: (v) => parseDateQueryParam(v) ?? now.toDate(),
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
    defaultValue: now
      .subtract(DOMAIN_WORKFLOWS_BASIC_START_DAYS_CONFIG, 'days')
      .toDate(),
    parseValue: (v) =>
      parseDateQueryParam(v) ??
      now.subtract(DOMAIN_WORKFLOWS_BASIC_START_DAYS_CONFIG, 'days').toDate(),
  },
  {
    key: 'timeRangeEndBasic',
    queryParamKey: 'end',
    defaultValue: now.toDate(),
    parseValue: (v) => parseDateQueryParam(v) ?? now.toDate(),
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
    defaultValue: now
      .subtract(DOMAIN_WORKFLOWS_ARCHIVAL_START_DAYS_CONFIG, 'days')
      .toDate(),
    parseValue: (v) =>
      parseDateQueryParam(v) ??
      now
        .subtract(DOMAIN_WORKFLOWS_ARCHIVAL_START_DAYS_CONFIG, 'days')
        .toDate(),
  },
  {
    key: 'timeRangeEndArchival',
    queryParamKey: 'aend',
    defaultValue: now.toDate(),
    parseValue: (v) => parseDateQueryParam(v) ?? now.toDate(),
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
] as const;

export default domainPageQueryParamsConfig;
