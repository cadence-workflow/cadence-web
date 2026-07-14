import { type DomainSchedulesCreateFormData } from '../domain-schedules-create-modal.types';

/** Minimal required create-schedule form fields for tests. */
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

export function createDomainSchedulesCreateFormData(
  overrides: Partial<DomainSchedulesCreateFormData> = {}
): DomainSchedulesCreateFormData {
  return { ...mockDomainSchedulesCreateFormData, ...overrides };
}
