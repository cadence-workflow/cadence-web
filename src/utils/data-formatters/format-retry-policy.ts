import type { RetryPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/RetryPolicy';

import formatDurationToSeconds from './format-duration-to-seconds';

const formatRetryPolicy = (retryPolicy: RetryPolicy | null | undefined) => {
  if (!retryPolicy) {
    return null;
  }

  const { expirationInterval, initialInterval, maximumInterval, ...rest } =
    retryPolicy;

  return {
    expirationIntervalInSeconds: formatDurationToSeconds(expirationInterval),
    initialIntervalInSeconds: formatDurationToSeconds(initialInterval),
    maximumIntervalInSeconds: formatDurationToSeconds(maximumInterval),
    ...rest,
  };
};

export default formatRetryPolicy;
