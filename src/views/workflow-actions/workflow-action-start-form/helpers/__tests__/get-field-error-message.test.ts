import { zodResolver } from '@hookform/resolvers/zod';
import { type FieldValues } from 'react-hook-form';
import { type z } from 'zod';

import { mockDomainSchedulesCreateFormData } from '@/views/domain-schedules/domain-schedules-create-modal/__fixtures__/mock-domain-schedules-create-form-data';
import { createScheduleFormSchema } from '@/views/domain-schedules/domain-schedules-create-modal/schemas/create-schedule-form-schema';
import { backfillScheduleFormSchema } from '@/views/schedule-actions/schedule-action-backfill-form/schemas/backfill-schedule-form-schema';

import { startWorkflowFormSchema } from '../../schemas/start-workflow-form-schema';
import getFieldErrorMessage from '../get-field-error-message';

describe('getFieldErrorMessage', () => {
  it('should return undefined when field has no error', () => {
    const fieldErrors = {};

    const result = getFieldErrorMessage(fieldErrors, 'name');

    expect(result).toBeUndefined();
  });

  it('should return string message for simple field error', () => {
    const fieldErrors = {
      name: {
        message: 'Task list name is required',
        type: 'required',
      },
    };

    const result = getFieldErrorMessage(fieldErrors, 'name');

    expect(result).toBe('Task list name is required');
  });

  it('should handle nested field paths with dot notation', () => {
    const fieldErrors = {
      retryPolicy: {
        initialIntervalSeconds: {
          message: 'Invalid initial interval',
          type: 'invalid',
        },
      },
    };

    const result = getFieldErrorMessage(
      fieldErrors,
      'retryPolicy.initialIntervalSeconds'
    );

    expect(result).toBe('Invalid initial interval');
  });

  it('should return undefined for non-existent nested field', () => {
    const fieldErrors = {
      retryPolicy: {
        initialIntervalSeconds: {
          message: 'Invalid initial interval',
          type: 'invalid',
        },
      },
    };

    const result = getFieldErrorMessage(fieldErrors, 'retryPolicy.nonExistent');

    expect(result).toBeUndefined();
  });
});

const multipleIssueCases: Array<{
  name: string;
  schema: z.ZodType<FieldValues, FieldValues>;
  values: FieldValues;
  field: string;
  requiredMessage: string;
}> = [
  {
    name: 'start workflow',
    schema: startWorkflowFormSchema,
    values: {
      workflowType: { name: [] },
      taskList: { name: 'task-list' },
      workerSDKLanguage: 'GO',
      executionStartToCloseTimeoutSeconds: 3600,
      scheduleType: 'NOW',
    },
    field: 'workflowType.name',
    requiredMessage: 'Workflow type name is required',
  },
  {
    name: 'create schedule',
    schema: createScheduleFormSchema,
    values: {
      ...mockDomainSchedulesCreateFormData,
      workflowType: { name: [] },
    },
    field: 'workflowType.name',
    requiredMessage: 'Workflow type is required',
  },
  {
    name: 'backfill schedule',
    schema: backfillScheduleFormSchema,
    values: { startTime: [], endTime: '2026-01-02T00:00:00Z' },
    field: 'startTime',
    requiredMessage: 'Start date is required',
  },
];

describe.each(multipleIssueCases)(
  '$name issue display',
  ({ schema, values, field, requiredMessage }) => {
    it.each(['firstError', 'all'] as const)(
      'shows only the first field message with criteriaMode=%s',
      async (criteriaMode) => {
        const parsed = schema.safeParse(values);
        expect(parsed.error?.issues).toEqual([
          expect.objectContaining({ code: 'invalid_type' }),
          expect.objectContaining({
            code: 'too_small',
            message: requiredMessage,
          }),
        ]);

        const { errors } = await zodResolver(schema)(values, undefined, {
          criteriaMode,
          fields: {},
          shouldUseNativeValidation: false,
        });
        expect(getFieldErrorMessage(errors, field)).toBe(
          parsed.error?.issues[0]?.message
        );
        expect(getFieldErrorMessage(errors, field)).not.toBe(requiredMessage);
      }
    );
  }
);
