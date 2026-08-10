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
      },
    });
  });

  it('omits the schedule id, which the update URL carries instead', () => {
    const result = transformEditScheduleFormToSubmission(
      mockEditScheduleFormData
    );

    expect(result).not.toHaveProperty('scheduleId');
  });
});
