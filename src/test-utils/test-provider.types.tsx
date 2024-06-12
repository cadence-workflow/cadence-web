import { type ReactElement } from 'react';

export type Props = {
  children?: ReactElement;
  router?: {
    initialUrl?: string;
    pathnames?: string[];
  };
};
