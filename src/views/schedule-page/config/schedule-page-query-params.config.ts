import { type DateFilterValue } from '@/components/date-filter/date-filter.types';
import parseDateFilterValue from '@/components/date-filter/helpers/parse-date-filter-value';
import {
  type PageQueryParamMultiValue,
  type PageQueryParam,
} from '@/hooks/use-page-query-params/use-page-query-params.types';
import isWorkflowStatus from '@/views/shared/workflow-status-tag/helpers/is-workflow-status';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

const schedulePageQueryParamsConfig: [
  PageQueryParam<'scheduleRunsTimeStart', DateFilterValue>,
  PageQueryParam<'scheduleRunsTimeEnd', DateFilterValue>,
  PageQueryParamMultiValue<
    'scheduleRunsStatuses',
    Array<WorkflowStatus> | undefined
  >,
] = [
  {
    key: 'scheduleRunsTimeStart',
    queryParamKey: 'runs-start',
    defaultValue: 'now-7d',
    parseValue: (value) => parseDateFilterValue(value) ?? 'now-7d',
  },
  {
    key: 'scheduleRunsTimeEnd',
    queryParamKey: 'runs-end',
    defaultValue: 'now',
    parseValue: (value) => parseDateFilterValue(value) ?? 'now',
  },
  {
    key: 'scheduleRunsStatuses',
    queryParamKey: 'runs-status',
    isMultiValue: true,
    parseValue: (values) =>
      values.every(isWorkflowStatus) ? values : undefined,
  },
] as const;

export default schedulePageQueryParamsConfig;
