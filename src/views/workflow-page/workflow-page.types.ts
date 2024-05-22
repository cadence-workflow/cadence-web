import React from 'react';

export type Props = {
  params: {
    domain: string;
    cluster: string;
    workflowId: string;
    runId: string;
  };
  children: React.ReactNode;
};
