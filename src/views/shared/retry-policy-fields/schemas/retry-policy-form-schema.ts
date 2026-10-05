import { z } from 'zod';

export const RETRY_LIMIT_TYPES = ['ATTEMPTS', 'DURATION'] as const;

export type RetryLimitType = (typeof RETRY_LIMIT_TYPES)[number];

const positiveIntegerStringSchema = z
  .string()
  .refine((value) => value === '' || /^[1-9]\d*$/.test(value), {
    message: 'Must be a positive integer',
  })
  .optional();

export const retryPolicyValueSchema = z.object({
  initialIntervalSeconds: positiveIntegerStringSchema,
  backoffCoefficient: z
    .string()
    .refine(
      (value) =>
        value === '' || (Number.isFinite(Number(value)) && Number(value) >= 1),
      { message: 'Must be a number greater than or equal to 1' }
    )
    .optional(),
  maximumIntervalSeconds: positiveIntegerStringSchema,
  maximumAttempts: positiveIntegerStringSchema,
  expirationIntervalSeconds: positiveIntegerStringSchema,
});

export const retryPolicyFormFieldsShape = {
  enableRetryPolicy: z.boolean().optional(),
  limitRetries: z.enum(RETRY_LIMIT_TYPES).optional(),
  retryPolicy: retryPolicyValueSchema.optional(),
} as const;

export type RetryPolicyFormFields = z.infer<
  z.ZodObject<typeof retryPolicyFormFieldsShape>
>;
