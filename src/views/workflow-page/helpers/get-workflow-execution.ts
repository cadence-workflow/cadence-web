import * as grpcClient from '@/utils/grpc/grpc-client';
import { cache } from 'react';

export const getWorkflowExecution = async (clusterName: any, args: any) => {
  const result =
    await grpcClient.clusterMethods[clusterName].describeWorkflow(args);

  return result;
};

export const getCachedWorkflowExecution = cache(getWorkflowExecution);
