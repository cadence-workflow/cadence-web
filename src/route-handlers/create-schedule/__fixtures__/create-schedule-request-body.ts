import { type CreateScheduleRequestBody } from '../create-schedule.types';

export const mockCreateScheduleRequestBody: CreateScheduleRequestBody = {
  scheduleId: 'my-schedule',
  cronExpression: '0 9 * * *',
  startWorkflow: {
    workflowType: { name: 'DemoWorkflow' },
    taskList: { name: 'demo-task-list' },
    workerSDKLanguage: 'GO',
    workflowIdPrefix: 'scheduled-demo-',
    executionStartToCloseTimeoutSeconds: 3600,
    taskStartToCloseTimeoutSeconds: 30,
  },
};
