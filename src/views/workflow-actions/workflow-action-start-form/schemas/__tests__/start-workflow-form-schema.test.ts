import { startWorkflowFormSchema } from '../start-workflow-form-schema';

const baseInput = {
  workflowType: { name: 'Workflow' },
  taskList: { name: 'task-list' },
  workerSDKLanguage: 'GO',
  executionStartToCloseTimeoutSeconds: 3600,
  scheduleType: 'NOW',
};

describe('start-workflow custom message parity', () => {
  it('does not suppress other refinements when required string values are empty', () => {
    const result = startWorkflowFormSchema.safeParse({
      ...baseInput,
      workflowType: { name: '' },
      taskList: { name: '' },
      scheduleType: 'LATER',
      enableRetryPolicy: true,
      limitRetries: 'ATTEMPTS',
      retryPolicy: {},
    });
    expect(
      result.error?.issues.map(({ path, message }) => ({ path, message }))
    ).toEqual([
      {
        path: ['workflowType', 'name'],
        message: 'Workflow type name is required',
      },
      { path: ['taskList', 'name'], message: 'Task list name is required' },
      {
        path: ['firstRunAt'],
        message: 'First run time is required when schedule type is LATER',
      },
      {
        path: ['retryPolicy', 'initialIntervalSeconds'],
        message: 'Initial interval is required',
      },
      {
        path: ['retryPolicy', 'backoffCoefficient'],
        message: 'Backoff coefficient is required',
      },
      {
        path: ['retryPolicy', 'maximumAttempts'],
        message: 'Maximum attempts is required',
      },
    ]);
  });
});
