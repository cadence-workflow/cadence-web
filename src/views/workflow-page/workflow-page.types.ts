import type React from 'react';

export type WorkflowPageParams = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
};

export type Props = {
  params: WorkflowPageParams;
  children: React.ReactNode;
};
