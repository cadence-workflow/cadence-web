import { type ScheduleDetailRowConfig } from './schedule-detail-sections.types';
import { formatScheduleDuration } from './schedule-details-formatters';

const scheduleActionDetailsConfig: ScheduleDetailRowConfig[] = [
  {
    key: 'workflowType',
    getLabel: () => 'Workflow type',
    getValue: ({ describeSchedule }) =>
      describeSchedule.action?.startWorkflow?.workflowType?.name,
    hide: ({ describeSchedule }) =>
      !describeSchedule.action?.startWorkflow?.workflowType?.name,
  },
  {
    key: 'taskList',
    getLabel: () => 'Task list',
    getValue: ({ describeSchedule }) =>
      describeSchedule.action?.startWorkflow?.taskList?.name,
    hide: ({ describeSchedule }) =>
      !describeSchedule.action?.startWorkflow?.taskList?.name,
  },
  {
    key: 'workflowIdPrefix',
    getLabel: () => 'Workflow ID prefix',
    getValue: ({ describeSchedule }) =>
      describeSchedule.action?.startWorkflow?.workflowIdPrefix,
    hide: ({ describeSchedule }) =>
      !describeSchedule.action?.startWorkflow?.workflowIdPrefix,
  },
  {
    key: 'executionTimeout',
    getLabel: () => 'Execution timeout',
    getValue: ({ describeSchedule }) =>
      formatScheduleDuration(
        describeSchedule.action?.startWorkflow?.executionStartToCloseTimeout
      ),
    hide: ({ describeSchedule }) =>
      !describeSchedule.action?.startWorkflow?.executionStartToCloseTimeout,
  },
  {
    key: 'taskTimeout',
    getLabel: () => 'Task timeout',
    getValue: ({ describeSchedule }) =>
      formatScheduleDuration(
        describeSchedule.action?.startWorkflow?.taskStartToCloseTimeout
      ),
    hide: ({ describeSchedule }) =>
      !describeSchedule.action?.startWorkflow?.taskStartToCloseTimeout,
  },
];

export default scheduleActionDetailsConfig;
