import { z } from 'zod';

import { type RetryPolicyFormFields } from './retry-policy-form.schema';

export default function refineRetryPolicyForm(
  data: RetryPolicyFormFields,
  ctx: z.RefinementCtx
) {
  if (!data.enableRetryPolicy) {
    return;
  }

  if (!data.retryPolicy?.initialIntervalSeconds) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Initial interval is required',
      path: ['retryPolicy', 'initialIntervalSeconds'],
    });
  }

  if (!data.retryPolicy?.backoffCoefficient) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Backoff coefficient is required',
      path: ['retryPolicy', 'backoffCoefficient'],
    });
  }

  if (data.limitRetries === 'ATTEMPTS') {
    if (!data.retryPolicy?.maximumAttempts) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Maximum attempts is required',
        path: ['retryPolicy', 'maximumAttempts'],
      });
    }
  } else if (!data.retryPolicy?.expirationIntervalSeconds) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Expiration interval is required',
      path: ['retryPolicy', 'expirationIntervalSeconds'],
    });
  }
}
