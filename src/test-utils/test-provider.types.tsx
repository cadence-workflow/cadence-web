import { type ReactElement } from 'react';

import {
  type QueryClient,
  type QueryClientConfig,
} from '@tanstack/react-query';

import type { Props as MSWMocksHandlersProps } from './msw-mock-handlers/msw-mock-handlers.types';

export type Props = {
  children?: ReactElement;
  router?: {
    initialUrl?: string;
    pathnames?: string[];
  };
  queryClientConfig?: QueryClientConfig;
  endpointsMocks?: MSWMocksHandlersProps['endpointsMocks'];
  enableAnimations?: boolean;
  isSnapshotTest?: boolean;
};

export type TestQueryClientRef = { current: QueryClient | null };
