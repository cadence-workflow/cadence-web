import type { ReactNode } from 'react';

export interface MDXSignalProps {
  domain: string;
  cluster?: string;
  'wf-id': string;
  'run-id': string;
  name: string;
  input?: Record<string, unknown> | unknown[];
  children: ReactNode;
}

