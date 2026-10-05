import { mockUpdateScheduleRequestBody } from '../../__fixtures__/update-schedule-request-body';
import transformUpdateScheduleBodyToGrpcInput from '../transform-update-schedule-body-to-grpc-input';

describe(transformUpdateScheduleBodyToGrpcInput.name, () => {
  it('maps the body onto spec, action and policies', () => {
    const result = transformUpdateScheduleBodyToGrpcInput({
      domain: 'mock-domain',
      scheduleId: 'mock-schedule-id',
      body: {
        ...mockUpdateScheduleRequestBody,
        startTime: '2026-01-01T00:00:00.000Z',
        jitterSeconds: 60,
        catchUpWindowSeconds: 120,
        pauseOnFailure: true,
      },
    });

    expect(result).toEqual({
      domain: 'mock-domain',
      scheduleId: 'mock-schedule-id',
      spec: expect.objectContaining({
        cronExpression: '0 9 * * *',
        startTime: { seconds: 1_767_225_600, nanos: 0 },
        jitter: { seconds: 60, nanos: 0 },
      }),
      action: {
        startWorkflow: expect.objectContaining({
          workflowType: { name: 'DemoWorkflow' },
          taskList: { name: 'demo-task-list' },
          executionStartToCloseTimeout: { seconds: 3600, nanos: 0 },
        }),
      },
      policies: expect.objectContaining({
        catchUpWindow: { seconds: 120, nanos: 0 },
        pauseOnFailure: true,
      }),
    });
  });

  it('does not forward a schedule id from the body', () => {
    const result = transformUpdateScheduleBodyToGrpcInput({
      domain: 'mock-domain',
      scheduleId: 'from-params',
      body: mockUpdateScheduleRequestBody,
    });

    expect(result.scheduleId).toEqual('from-params');
  });
});
