import { mockEditScheduleFormData } from '../../__fixtures__/mock-edit-schedule-form-data';
import transformEditScheduleFormToSubmission from '../transform-edit-schedule-form-to-submission';

describe(transformEditScheduleFormToSubmission.name, () => {
  it('maps the form onto the update schedule body', () => {
    const result = transformEditScheduleFormToSubmission(
      mockEditScheduleFormData
    );

    expect(result).toEqual({
      cronExpression: '0 9 * * *',
      pauseOnFailure: false,
      startWorkflow: {
        workflowType: { name: 'DemoWorkflow' },
        taskList: { name: 'demo-task-list' },
        workerSDKLanguage: 'GO',
        executionStartToCloseTimeoutSeconds: 3600,
        taskStartToCloseTimeoutSeconds: undefined,
      },
    });
    expect(result).not.toHaveProperty('scheduleId');
  });

  it('keeps a prefilled task start-to-close timeout on the update body', () => {
    const result = transformEditScheduleFormToSubmission({
      ...mockEditScheduleFormData,
      taskStartToCloseTimeoutSeconds: 30,
    });

    expect(result.startWorkflow.taskStartToCloseTimeoutSeconds).toBe(30);
  });
});
