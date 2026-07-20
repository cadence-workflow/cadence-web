import { type DateFilterValue } from '@/components/date-filter/date-filter.types';
import parseDateFilterValue from '@/components/date-filter/helpers/parse-date-filter-value';
import {
  type PageQueryParamMultiValue,
  type PageQueryParam,
} from '@/hooks/use-page-query-params/use-page-query-params.types';
import { type ScheduleRunsRunType } from '@/views/schedule-runs/schedule-runs.types';
import isWorkflowStatus from '@/views/shared/workflow-status-tag/helpers/is-workflow-status';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

const schedulePageQueryParamsConfig: [
  PageQueryParam<'scheduleRunsSearch', string>,
  PageQueryParam<'scheduleRunsTimeStart', DateFilterValue | undefined>,
  PageQueryParam<'scheduleRunsTimeEnd', DateFilterValue | undefined>,
  PageQueryParamMultiValue<
    'scheduleRunsStatuses',
    Array<WorkflowStatus> | undefined
  >,
  PageQueryParam<'scheduleRunsRunType', ScheduleRunsRunType>,
] = [
  {
    key: 'scheduleRunsSearch',
    queryParamKey: 'runs-search',
    defaultValue: '',
  },
  {
    key: 'scheduleRunsTimeStart',
    queryParamKey: 'runs-start',
    parseValue: parseDateFilterValue,
  },
  {
    key: 'scheduleRunsTimeEnd',
    queryParamKey: 'runs-end',
    parseValue: (value) =>
      value === 'now' ? 'now' : parseDateFilterValue(value),
  },
  {
    key: 'scheduleRunsStatuses',
    queryParamKey: 'runs-status',
    isMultiValue: true,
    parseValue: (values) =>
      values.every(isWorkflowStatus) ? values : undefined,
  },
  {
    key: 'scheduleRunsRunType',
    queryParamKey: 'runs-type',
    defaultValue: 'all',
    parseValue: (value) =>
      value === 'backfill' || value === 'regular' ? value : 'all',
  },
] as const;

export default schedulePageQueryParamsConfig;
