import { type EditScheduleFormData } from '../schedule-action-edit-form.types';

export const mockEditScheduleFormData: EditScheduleFormData = {
  scheduleId: 'mock-schedule-id',
  cronExpression: {
    minutes: '0',
    hours: '9',
    daysOfMonth: '*',
    months: '*',
    daysOfWeek: '*',
  },
  workflowType: { name: 'DemoWorkflow' },
  taskList: { name: 'demo-task-list' },
  workerSDKLanguage: 'GO',
  executionStartToCloseTimeoutSeconds: 3600,
  taskStartToCloseTimeoutSeconds: 30,
  input: [''],
  pauseOnFailure: false,
};
