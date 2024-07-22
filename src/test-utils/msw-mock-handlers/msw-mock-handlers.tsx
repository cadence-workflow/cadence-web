import { memo } from 'react';

import mswMockEndpoints from './helper/msw-mock-endpoints';
import { type Props } from './msw-mock-handlers.types';

export default memo(function MSWMockHandlers({ endpointsMocks }: Props) {
  if (endpointsMocks) mswMockEndpoints(endpointsMocks);

  return null;
});
