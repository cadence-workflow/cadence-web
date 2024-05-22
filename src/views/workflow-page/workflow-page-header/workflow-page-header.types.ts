import React from 'react';

export type Props = {
  domain: string;
  workflowId: string;
  runId: string;
  cluster: string;
  workflowStatusTag: React.ReactNode;
};
