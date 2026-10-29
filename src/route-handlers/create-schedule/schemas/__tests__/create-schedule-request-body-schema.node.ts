import { mockCreateScheduleRequestBody } from '../../__fixtures__/create-schedule-request-body';
import createScheduleRequestBodySchema from '../create-schedule-request-body-schema';

describe.each(['bufferLimit', 'concurrencyLimit'] as const)(
  '%s integer validation',
  (field) => {
    it.each([0, 1, 2147483647])(
      'continues to accept backend int32 value %p',
      (value) => {
        const input = { ...mockCreateScheduleRequestBody, [field]: value };
        expect(createScheduleRequestBodySchema.parse(input)[field]).toBe(value);
      }
    );

    it.each([Number.MAX_SAFE_INTEGER + 1, 1e20])(
      'rejects unsafe integer %p with the native error',
      (value) => {
        const result = createScheduleRequestBodySchema.safeParse({
          ...mockCreateScheduleRequestBody,
          [field]: value,
        });
        expect(result.error?.issues).toEqual([
          expect.objectContaining({
            path: [field],
            code: 'too_big',
            maximum: Number.MAX_SAFE_INTEGER,
          }),
        ]);
      }
    );
  }
);
