import { cache } from 'react';

import * as grpcClient from '@/utils/grpc/grpc-client';

export const getWorkflowExecution = async (clusterName: any, args: any) => {
  const result =
    await grpcClient.clusterMethods[clusterName].describeWorkflow(args);

  return result;
};

export const getCachedWorkflowExecution = cache(getWorkflowExecution);
