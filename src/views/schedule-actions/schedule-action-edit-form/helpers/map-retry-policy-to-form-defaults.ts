import { type RetryPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/RetryPolicy';
import formatDurationToSeconds from '@/utils/data-formatters/format-duration-to-seconds';
import { type RetryPolicyFormFields } from '@/views/shared/retry-policy-fields/schemas/retry-policy-form-schema';

import { type ExhaustiveDefaults } from '../schedule-action-edit-form.types';

/**
 * Has its own exhaustive return type: the top-level one cannot reach into the
 * nested retry policy object, whose sub-fields are all optional too.
 */
export default function mapRetryPolicyToFormDefaults(
  retryPolicy: RetryPolicy | null | undefined
): ExhaustiveDefaults<RetryPolicyFormFields> {
  if (!retryPolicy) {
    return {
      enableRetryPolicy: false,
      limitRetries: undefined,
      retryPolicy: undefined,
    };
  }

  const expirationIntervalSeconds = formatDurationToSeconds(
    retryPolicy.expirationInterval
  );

  const retryPolicyValues: ExhaustiveDefaults<
    NonNullable<RetryPolicyFormFields['retryPolicy']>
  > = {
    initialIntervalSeconds: stringifyPositiveNumber(
      formatDurationToSeconds(retryPolicy.initialInterval)
    ),
    backoffCoefficient: stringifyPositiveNumber(retryPolicy.backoffCoefficient),
    maximumIntervalSeconds: stringifyPositiveNumber(
      formatDurationToSeconds(retryPolicy.maximumInterval)
    ),
    maximumAttempts: stringifyPositiveNumber(retryPolicy.maximumAttempts),
    expirationIntervalSeconds: stringifyPositiveNumber(
      expirationIntervalSeconds
    ),
  };

  return {
    enableRetryPolicy: true,
    // The form offers the two limits as an either/or, and the schedule only
    // carries an expiration interval when it was configured by duration.
    limitRetries: expirationIntervalSeconds ? 'DURATION' : 'ATTEMPTS',
    retryPolicy: retryPolicyValues,
  };
}

/** Zero and missing values both mean "unset" for these form fields. */
function stringifyPositiveNumber(value: number | null | undefined) {
  return value ? String(value) : undefined;
}
