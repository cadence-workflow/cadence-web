import { type ReactNode } from 'react';

export type MarkdownContextType = {
  domain?: string;
  cluster?: string;
  workflowId?: string;
  runId?: string;
  onActionSuccess?: () => void;
};

export type Props = MarkdownContextType & {
  children: ReactNode;
};
