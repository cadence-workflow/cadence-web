import { type RetryPolicyFormFields } from './retry-policy-form.schema';
import { type RetryPolicyBody } from './retry-policy.types';

export default function mapRetryPolicyFormToBody(
  formData: RetryPolicyFormFields
): RetryPolicyBody | undefined {
  if (!formData.enableRetryPolicy || !formData.retryPolicy) {
    return undefined;
  }

  return {
    initialIntervalSeconds: formData.retryPolicy.initialIntervalSeconds,
    backoffCoefficient: formData.retryPolicy.backoffCoefficient,
    ...(formData.retryPolicy.maximumIntervalSeconds !== undefined
      ? {
          maximumIntervalSeconds: formData.retryPolicy.maximumIntervalSeconds,
        }
      : {}),
    ...(formData.limitRetries === 'ATTEMPTS'
      ? { maximumAttempts: formData.retryPolicy.maximumAttempts }
      : {
          expirationIntervalSeconds:
            formData.retryPolicy.expirationIntervalSeconds,
        }),
  };
}
