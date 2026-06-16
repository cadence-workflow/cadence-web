import type { ReactNode } from 'react';

export type Props = {
  label: ReactNode;
  description?: ReactNode;
  /** When set, associates the left column with the control via `htmlFor` / `id`. */
  htmlFor?: string;
  error?: ReactNode;
  children: ReactNode;
};
