import { getMockEditableDescribeScheduleResponse } from '@/views/schedule-actions/schedule-action-edit-form/__fixtures__/mock-editable-describe-schedule-response';
import transformDescribeScheduleResponseToFormData from '@/views/schedule-actions/schedule-action-edit-form/helpers/transform-describe-schedule-response-to-form-data';

import { mockDomainSchedulesCreateFormData } from '../../__fixtures__/mock-domain-schedules-create-form-data';
import { createScheduleFormSchema } from '../create-schedule-form-schema';

describe('create schedule validation messages', () => {
  it.each([
    [undefined, 'Execution timeout is required'],
    [null, 'Invalid input: expected number, received null'],
    ['1', 'Invalid input: expected number, received string'],
    [NaN, 'Invalid input: expected number, received NaN'],
    [0, 'Execution timeout must be positive'],
    [-1, 'Execution timeout must be positive'],
  ])(
    'keeps required, wrong-type and positive-timeout errors distinct for %p',
    (value, message) => {
      const result = createScheduleFormSchema.safeParse({
        ...mockDomainSchedulesCreateFormData,
        executionStartToCloseTimeoutSeconds: value,
      });
      expect(
        result.error?.issues.map(({ path, message }) => ({ path, message }))
      ).toEqual([{ path: ['executionStartToCloseTimeoutSeconds'], message }]);
    }
  );

  it.each([undefined, null, 1, false, [], {}])(
    'keeps the required SDK message for non-string input %p',
    (workerSDKLanguage) => {
      const result = createScheduleFormSchema.safeParse({
        ...mockDomainSchedulesCreateFormData,
        workerSDKLanguage,
      });
      expect(
        result.error?.issues.map(({ path, message }) => ({ path, message }))
      ).toEqual([
        { path: ['workerSDKLanguage'], message: 'Worker SDK is required' },
      ]);
    }
  );

  it.each(['', 'RUBY'])(
    'uses the default enum message, not the required message, for invalid string %p',
    (workerSDKLanguage) => {
      const result = createScheduleFormSchema.safeParse({
        ...mockDomainSchedulesCreateFormData,
        workerSDKLanguage,
      });
      expect(result.error?.issues).toEqual([
        expect.objectContaining({
          path: ['workerSDKLanguage'],
          code: 'invalid_value',
          message: 'Invalid option: expected one of "GO"|"JAVA"|"PYTHON"',
        }),
      ]);
    }
  );

  it('reports multiple field errors with their original custom messages and paths', () => {
    const result = createScheduleFormSchema.safeParse({
      ...mockDomainSchedulesCreateFormData,
      workflowType: { name: '' },
      taskList: { name: '' },
      executionStartToCloseTimeoutSeconds: 0,
      workerSDKLanguage: undefined,
      input: ['bad', 'also bad'],
    });
    expect(
      result.error?.issues.map(({ path, message }) => ({ path, message }))
    ).toEqual([
      { path: ['workflowType', 'name'], message: 'Workflow type is required' },
      { path: ['taskList', 'name'], message: 'Task list is required' },
      {
        path: ['executionStartToCloseTimeoutSeconds'],
        message: 'Execution timeout must be positive',
      },
      { path: ['workerSDKLanguage'], message: 'Worker SDK is required' },
      { path: ['input', 0], message: 'Input must be valid JSON' },
      { path: ['input', 1], message: 'Input must be valid JSON' },
    ]);
  });
});

describe('create-schedule data and error parity', () => {
  it.each(['2026-01-01T00:00:00Z', '2026-01-01T00:00:00.123456789Z'])(
    'accepts and preserves timestamp %s',
    (startTime) => {
      expect(
        createScheduleFormSchema.parse({
          ...mockDomainSchedulesCreateFormData,
          startTime,
        }).startTime
      ).toBe(startTime);
    }
  );
});

it('accepts timestamps from the backend schedule prefill mapper unchanged', () => {
  const { startTime, endTime } = transformDescribeScheduleResponseToFormData(
    getMockEditableDescribeScheduleResponse(),
    'schedule'
  );
  expect(startTime).toBeDefined();
  expect(endTime).toBeDefined();
  const result = createScheduleFormSchema.parse({
    ...mockDomainSchedulesCreateFormData,
    startTime,
    endTime,
  });
  expect(result.startTime).toBe(startTime);
  expect(result.endTime).toBe(endTime);
});

describe.each([
  ['startTime', 'Start time must be valid'],
  ['endTime', 'End time must be valid'],
] as const)('%s datetime messages', (field, message) => {
  it.each([null, 123, 'not-a-date'])(
    'uses the custom datetime message for invalid value %p',
    (value) => {
      const result = createScheduleFormSchema.safeParse({
        ...mockDomainSchedulesCreateFormData,
        [field]: value,
      });
      expect(result.error?.issues[0]).toEqual(
        expect.objectContaining({ path: [field], message })
      );
    }
  );
});
