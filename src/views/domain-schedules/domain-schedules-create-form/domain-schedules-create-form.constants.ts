/** Stable ids for horizontal label + control layout (single create-schedule modal instance). */
export const DOMAIN_SCHEDULES_CREATE_FORM_FIELD_IDS = {
  workflowType: 'domain-schedules-create-form-workflow-type',
  taskList: 'domain-schedules-create-form-task-list',
  taskStartToCloseTimeout: 'domain-schedules-create-form-task-stc-timeout',
  executionStartToCloseTimeout:
    'domain-schedules-create-form-execution-stc-timeout',
  pauseOnFailure: 'domain-schedules-create-form-pause-on-failure',
  workerSDK: 'domain-schedules-create-form-worker-sdk',
} as const;

export const DOMAIN_SCHEDULES_CREATE_FORM_MAIN_FIELD_DESCRIPTIONS = {
  cronExpression: 'Cron string describing the schedule for running workflows',
  workflowType: 'WorkflowType of the workflow that the schedule will start',
  taskList: 'TaskList of the workflow that the schedule will start',
  taskStartToCloseTimeout: 'Activity & decision tasks start to close timeout',
  executionStartToCloseTimeout: 'Workflow start to close timeout',
  pauseOnFailure: 'Pause the schedule when a triggered workflow fails',
  workerSDK:
    'Worker language for encoding workflow arguments (matches Start workflow)',
  workflowInput:
    'Optional JSON payloads passed to the workflow (one value per argument)',
} as const;
