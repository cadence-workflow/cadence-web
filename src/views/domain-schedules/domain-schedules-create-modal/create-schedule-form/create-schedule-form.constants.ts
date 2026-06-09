/** Stable ids for horizontal label + control layout (single create-schedule modal instance). */
export const CREATE_SCHEDULE_FORM_FIELD_IDS = {
  workflowType: 'create-schedule-form-workflow-type',
  taskList: 'create-schedule-form-task-list',
  taskStartToCloseTimeout: 'create-schedule-form-task-stc-timeout',
  executionStartToCloseTimeout: 'create-schedule-form-execution-stc-timeout',
  pauseOnFailure: 'create-schedule-form-pause-on-failure',
  workerSDK: 'create-schedule-form-worker-sdk',
} as const;

export const CREATE_SCHEDULE_MAIN_FIELD_DESCRIPTIONS = {
  cronExpression: 'Cron string describing the schedule for running workflows',
  workflowType: 'WorkflowType of the target workflow the schedule starts',
  taskList: 'TaskList of the target workflow the schedule starts',
  taskStartToCloseTimeout: 'Activity & decision tasks start to close timeout',
  executionStartToCloseTimeout: 'Workflow start to close timeout',
  pauseOnFailure: 'Pause the schedule when a triggered workflow fails',
  workerSDK: 'SDK language used by the workers processing scheduled workflows',
  workflowInput: 'Optional JSON arguments passed to each scheduled workflow run',
} as const;
