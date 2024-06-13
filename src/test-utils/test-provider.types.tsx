import { type ReactElement } from 'react';

import { type QueryClientConfig } from '@tanstack/react-query';

export type Props = {
  children?: ReactElement;
  router?: {
    initialUrl?: string;
    pathnames?: string[];
  };
  queryClientConfig?: QueryClientConfig;
};
