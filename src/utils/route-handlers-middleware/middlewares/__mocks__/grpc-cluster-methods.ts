import { type GRPCClusterMethods } from '@/utils/grpc/grpc-client';

export const mockGrpcClusterMethods: GRPCClusterMethods = {
  archivedWorkflows: jest.fn(),
  closedWorkflows: jest.fn(),
  describeCluster: jest.fn(),
  describeDomain: jest.fn(),
  updateDomain: jest.fn(),
  describeTaskList: jest.fn(),
  describeWorkflow: jest.fn(),
  exportHistory: jest.fn(),
  getHistory: jest.fn(),
  listDomains: jest.fn(),
  listTaskListPartitions: jest.fn(),
  listWorkflows: jest.fn(),
  openWorkflows: jest.fn(),
  queryWorkflow: jest.fn(),
  signalWorkflow: jest.fn(),
  terminateWorkflow: jest.fn(),
  requestCancelWorkflow: jest.fn(),
};
