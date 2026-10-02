import { type ReactNode } from 'react';

export type MarkdownContextType = {
  domain?: string;
  cluster?: string;
  workflowId?: string;
  runId?: string;
};

export type Props = MarkdownContextType & {
  children: ReactNode;
};
