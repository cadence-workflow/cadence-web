import { type Failure } from '@/__generated__/proto-ts/uber/cadence/api/v1/Failure';

import formatBase64Payload from './format-base64-payload';

const formatFailureDetails = (failure: Pick<Failure, 'details'> | null) => {
  if (!failure?.details) {
    return null;
  }

  const decodedFailureDetails = formatBase64Payload(failure.details);

  try {
    return JSON.parse(decodedFailureDetails);
  } catch {
    return decodedFailureDetails;
  }
};

export default formatFailureDetails;
