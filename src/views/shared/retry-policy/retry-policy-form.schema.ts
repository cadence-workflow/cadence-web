import { z } from 'zod';

export const RETRY_LIMIT_TYPES = ['ATTEMPTS', 'DURATION'] as const;

export type RetryLimitType = (typeof RETRY_LIMIT_TYPES)[number];

export const retryPolicyValueSchema = z.object({
  initialIntervalSeconds: z.number().positive().optional(),
  backoffCoefficient: z.number().min(1).optional(),
  maximumIntervalSeconds: z.number().positive().optional(),
  maximumAttempts: z.number().int().positive().optional(),
  expirationIntervalSeconds: z.number().positive().optional(),
});

export const retryPolicyFormFieldsShape = {
  enableRetryPolicy: z.boolean().optional(),
  limitRetries: z.enum(RETRY_LIMIT_TYPES).optional(),
  retryPolicy: retryPolicyValueSchema.optional(),
} as const;

export type RetryPolicyFormFields = z.infer<
  z.ZodObject<typeof retryPolicyFormFieldsShape>
>;
