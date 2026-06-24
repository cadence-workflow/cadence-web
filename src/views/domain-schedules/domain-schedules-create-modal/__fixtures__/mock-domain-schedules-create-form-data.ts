import { type DomainSchedulesCreateFormData } from '../domain-schedules-create-modal.types';

export const mockDomainSchedulesCreateFormData = {
  cronExpression: {
    minutes: '0',
    hours: '9',
    daysOfMonth: '*',
    months: '*',
    daysOfWeek: '*',
  },
  workflowType: { name: 'DemoWorkflow' },
  taskList: { name: 'demo-tl' },
  workerSDKLanguage: 'GO',
  executionStartToCloseTimeoutSeconds: 3600,
  taskStartToCloseTimeoutSeconds: 45,
} satisfies DomainSchedulesCreateFormData;
