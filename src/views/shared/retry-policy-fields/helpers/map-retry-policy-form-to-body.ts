import { type RetryPolicyBody } from '../retry-policy.types';
import { type RetryPolicyFormFields } from '../schemas/retry-policy-form-schema';

export default function mapRetryPolicyFormToBody(
  formData: RetryPolicyFormFields
): RetryPolicyBody | undefined {
  if (!formData.enableRetryPolicy || !formData.retryPolicy) {
    return undefined;
  }

  return {
    initialIntervalSeconds: formData.retryPolicy.initialIntervalSeconds
      ? parseInt(formData.retryPolicy.initialIntervalSeconds, 10)
      : undefined,
    backoffCoefficient: formData.retryPolicy.backoffCoefficient
      ? parseFloat(formData.retryPolicy.backoffCoefficient)
      : undefined,
    ...(formData.retryPolicy.maximumIntervalSeconds
      ? {
          maximumIntervalSeconds: parseInt(
            formData.retryPolicy.maximumIntervalSeconds,
            10
          ),
        }
      : {}),
    ...(formData.limitRetries === 'ATTEMPTS'
      ? {
          maximumAttempts: formData.retryPolicy.maximumAttempts
            ? parseInt(formData.retryPolicy.maximumAttempts, 10)
            : undefined,
        }
      : {
          expirationIntervalSeconds: formData.retryPolicy
            .expirationIntervalSeconds
            ? parseInt(formData.retryPolicy.expirationIntervalSeconds, 10)
            : undefined,
        }),
  };
}
