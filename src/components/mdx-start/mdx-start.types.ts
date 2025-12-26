import type { ReactNode } from 'react';

export interface MDXStartProps {
  domain: string;
  cluster?: string;
  'workflow-type': string;
  'task-list': string;
  'wf-id'?: string;
  input?: unknown[];
  'timeout-seconds'?: number;
  children: ReactNode;
}

