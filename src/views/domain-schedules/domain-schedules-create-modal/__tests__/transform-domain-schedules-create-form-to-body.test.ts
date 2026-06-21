import { type DomainSchedulesCreateFormData } from '../domain-schedules-create-modal.types';
import transformDomainSchedulesCreateFormToBody from '../helpers/transform-domain-schedules-create-form-to-body';

describe(transformDomainSchedulesCreateFormToBody.name, () => {
  const baseForm: DomainSchedulesCreateFormData = {
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
    pauseOnFailure: false,
  };

  it('maps form fields to create-schedule request body', () => {
    const result = transformDomainSchedulesCreateFormToBody(baseForm);

    expect(result).toEqual({
      cronExpression: '0 9 * * *',
      pauseOnFailure: false,
      startWorkflow: {
        workflowType: { name: 'DemoWorkflow' },
        taskList: { name: 'demo-tl' },
        workerSDKLanguage: 'GO',
        executionStartToCloseTimeoutSeconds: 3600,
        taskStartToCloseTimeoutSeconds: 45,
      },
    });
  });

  it('includes parsed JSON inputs when provided', () => {
    const result = transformDomainSchedulesCreateFormToBody({
      ...baseForm,
      input: ['"a"', '42'],
    });

    expect(result.startWorkflow.input).toEqual(['a', 42]);
  });

  it('omits input when only empty strings are present', () => {
    const result = transformDomainSchedulesCreateFormToBody({
      ...baseForm,
      input: ['', '  '],
    });

    expect(result.startWorkflow.input).toBeUndefined();
  });

  it('trims workflow type and task list names', () => {
    const result = transformDomainSchedulesCreateFormToBody({
      ...baseForm,
      workflowType: { name: ' DemoWorkflow ' },
      taskList: { name: ' demo-tl ' },
    });

    expect(result.startWorkflow.workflowType.name).toBe('DemoWorkflow');
    expect(result.startWorkflow.taskList.name).toBe('demo-tl');
  });
});
