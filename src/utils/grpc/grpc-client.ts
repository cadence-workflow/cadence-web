import { type DescribeClusterRequest__Input } from '@/__generated__/proto-ts/uber/cadence/admin/v1/DescribeClusterRequest';
import { type DescribeClusterResponse } from '@/__generated__/proto-ts/uber/cadence/admin/v1/DescribeClusterResponse';
import { type DescribeWorkflowExecutionRequest__Input } from '@/__generated__/proto-ts/uber/cadence/admin/v1/DescribeWorkflowExecutionRequest';
import { type DescribeDomainRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeDomainRequest';
import { type DescribeDomainResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeDomainResponse';
import { type DescribeTaskListRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeTaskListRequest';
import { type DescribeTaskListResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeTaskListResponse';
import { type DescribeWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeWorkflowExecutionResponse';
import { type GetWorkflowExecutionHistoryRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/GetWorkflowExecutionHistoryRequest';
import { type GetWorkflowExecutionHistoryResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/GetWorkflowExecutionHistoryResponse';
import { type ListArchivedWorkflowExecutionsRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/ListArchivedWorkflowExecutionsRequest';
import { type ListArchivedWorkflowExecutionsResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/ListArchivedWorkflowExecutionsResponse';
import { type ListClosedWorkflowExecutionsRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/ListClosedWorkflowExecutionsRequest';
import { type ListClosedWorkflowExecutionsResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/ListClosedWorkflowExecutionsResponse';
import { type ListDomainsRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/ListDomainsRequest';
import { type ListDomainsResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/ListDomainsResponse';
import { type ListOpenWorkflowExecutionsRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/ListOpenWorkflowExecutionsRequest';
import { type ListOpenWorkflowExecutionsResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/ListOpenWorkflowExecutionsResponse';
import { type ListTaskListPartitionsRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/ListTaskListPartitionsRequest';
import { type ListTaskListPartitionsResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/ListTaskListPartitionsResponse';
import { type ListWorkflowExecutionsRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/ListWorkflowExecutionsRequest';
import { type ListWorkflowExecutionsResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/ListWorkflowExecutionsResponse';
import { type QueryWorkflowRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/QueryWorkflowRequest';
import { type QueryWorkflowResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/QueryWorkflowResponse';
import { type SignalWorkflowExecutionRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/SignalWorkflowExecutionRequest';
import { type SignalWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/SignalWorkflowExecutionResponse';
import { type TerminateWorkflowExecutionRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/TerminateWorkflowExecutionRequest';
import { type TerminateWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/TerminateWorkflowExecutionResponse';
import { type UpdateDomainRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/UpdateDomainRequest';
import { type UpdateDomainResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/UpdateDomainResponse';
import CLUSTERS_CONFIGS from '@/config/clusters/clusters.config';

import grpcServiceConfigurations from '../../config/grpc/grpc-services-config';

import GRPCService, {
  type GRPCMetadata,
  type GRPCRequestConfig,
} from './grpc-service';

type ClusterServices = Record<
  string,
  Record<
    'adminService' | 'domainService' | 'visibilityService' | 'workflowService',
    GRPCService
  >
>;
export type GRPCClusterMethods = {
  archivedWorkflows: (
    payload: ListArchivedWorkflowExecutionsRequest__Input
  ) => Promise<ListArchivedWorkflowExecutionsResponse>;
  closedWorkflows: (
    payload: ListClosedWorkflowExecutionsRequest__Input
  ) => Promise<ListClosedWorkflowExecutionsResponse>;
  describeCluster: (
    payload: DescribeClusterRequest__Input
  ) => Promise<DescribeClusterResponse>;
  describeDomain: (
    payload: DescribeDomainRequest__Input
  ) => Promise<DescribeDomainResponse>;
  updateDomain: (
    payload: UpdateDomainRequest__Input
  ) => Promise<UpdateDomainResponse>;
  describeTaskList: (
    paload: DescribeTaskListRequest__Input
  ) => Promise<DescribeTaskListResponse>;
  describeWorkflow: (
    payload: DescribeWorkflowExecutionRequest__Input
  ) => Promise<DescribeWorkflowExecutionResponse>;
  exportHistory: (
    payload: GetWorkflowExecutionHistoryRequest__Input
  ) => Promise<GetWorkflowExecutionHistoryResponse>;
  getHistory: (
    payload: GetWorkflowExecutionHistoryRequest__Input
  ) => Promise<GetWorkflowExecutionHistoryResponse>;
  listDomains: (
    payload: ListDomainsRequest__Input
  ) => Promise<ListDomainsResponse>;
  listTaskListPartitions: (
    payload: ListTaskListPartitionsRequest__Input
  ) => Promise<ListTaskListPartitionsResponse>;
  listWorkflows: (
    payload: ListWorkflowExecutionsRequest__Input
  ) => Promise<ListWorkflowExecutionsResponse>;
  openWorkflows: (
    payload: ListOpenWorkflowExecutionsRequest__Input
  ) => Promise<ListOpenWorkflowExecutionsResponse>;
  queryWorkflow: (
    payload: QueryWorkflowRequest__Input
  ) => Promise<QueryWorkflowResponse>;
  signalWorkflow: (
    payload: SignalWorkflowExecutionRequest__Input
  ) => Promise<SignalWorkflowExecutionResponse>;
  terminateWorkflow: (
    payload: TerminateWorkflowExecutionRequest__Input
  ) => Promise<TerminateWorkflowExecutionResponse>;
};

const clusterServices = CLUSTERS_CONFIGS.reduce((result, c) => {
  const requestConfig: GRPCRequestConfig = {
    serviceName: c.grpc.serviceName,
    metadata: c.grpc.metadata,
  };

  const adminService = new GRPCService({
    peer: c.grpc.peer,
    requestConfig,
    ...grpcServiceConfigurations.adminServiceConfig,
  });
  const domainService = new GRPCService({
    peer: c.grpc.peer,
    requestConfig,
    ...grpcServiceConfigurations.domainServiceConfig,
  });
  const visibilityService = new GRPCService({
    peer: c.grpc.peer,
    requestConfig,
    ...grpcServiceConfigurations.visibilityServiceConfig,
  });
  const workflowService = new GRPCService({
    peer: c.grpc.peer,
    requestConfig,
    ...grpcServiceConfigurations.workflowServiceConfig,
  });

  result[c.clusterName] = {
    adminService,
    domainService,
    visibilityService,
    workflowService,
  };
  return result;
}, {} as ClusterServices);

const getClusterServicesMethods = (
  c: string,
  metadata?: GRPCMetadata
): GRPCClusterMethods => {
  const { visibilityService, adminService, domainService, workflowService } =
    clusterServices[c];

  return {
    archivedWorkflows: visibilityService.request<
      ListArchivedWorkflowExecutionsRequest__Input,
      ListArchivedWorkflowExecutionsResponse
    >({
      method: 'ListArchivedWorkflowExecutions',
      metadata: metadata,
    }),
    closedWorkflows: visibilityService.request<
      ListClosedWorkflowExecutionsRequest__Input,
      ListClosedWorkflowExecutionsResponse
    >({
      method: 'ListClosedWorkflowExecutions',
      metadata: metadata,
    }),
    describeCluster: adminService.request<
      DescribeClusterRequest__Input,
      DescribeClusterResponse
    >({
      method: 'DescribeCluster',
      metadata: metadata,
    }),
    describeDomain: domainService.request<
      DescribeDomainRequest__Input,
      DescribeDomainResponse
    >({
      method: 'DescribeDomain',
      metadata: metadata,
    }),
    updateDomain: domainService.request<
      UpdateDomainRequest__Input,
      UpdateDomainResponse
    >({ method: 'UpdateDomain', metadata: metadata }),
    describeTaskList: workflowService.request<
      DescribeTaskListRequest__Input,
      DescribeTaskListResponse
    >({
      method: 'DescribeTaskList',
      metadata: metadata,
    }),
    describeWorkflow: workflowService.request<
      DescribeWorkflowExecutionRequest__Input,
      DescribeWorkflowExecutionResponse
    >({
      method: 'DescribeWorkflowExecution',
      metadata: metadata,
    }),
    exportHistory: workflowService.request<
      GetWorkflowExecutionHistoryRequest__Input,
      GetWorkflowExecutionHistoryResponse
    >({
      method: 'GetWorkflowExecutionHistory',
      metadata: metadata,
    }),
    getHistory: workflowService.request<
      GetWorkflowExecutionHistoryRequest__Input,
      GetWorkflowExecutionHistoryResponse
    >({
      method: 'GetWorkflowExecutionHistory',
      metadata: metadata,
    }),
    listDomains: domainService.request<
      ListDomainsRequest__Input,
      ListDomainsResponse
    >({
      method: 'ListDomains',
      metadata: metadata,
    }),
    listTaskListPartitions: workflowService.request<
      ListTaskListPartitionsRequest__Input,
      ListTaskListPartitionsResponse
    >({
      method: 'ListTaskListPartitions',
      metadata: metadata,
    }),
    listWorkflows: visibilityService.request<
      ListWorkflowExecutionsRequest__Input,
      ListWorkflowExecutionsResponse
    >({
      method: 'ListWorkflowExecutions',
      metadata: metadata,
    }),
    openWorkflows: visibilityService.request<
      ListOpenWorkflowExecutionsRequest__Input,
      ListOpenWorkflowExecutionsResponse
    >({
      method: 'ListOpenWorkflowExecutions',
      metadata: metadata,
    }),
    queryWorkflow: workflowService.request<
      QueryWorkflowRequest__Input,
      QueryWorkflowResponse
    >({
      method: 'QueryWorkflow',
      metadata: metadata,
    }),
    signalWorkflow: workflowService.request<
      SignalWorkflowExecutionRequest__Input,
      SignalWorkflowExecutionResponse
    >({
      method: 'SignalWorkflowExecution',
      metadata: metadata,
    }),
    terminateWorkflow: workflowService.request<
      TerminateWorkflowExecutionRequest__Input,
      TerminateWorkflowExecutionResponse
    >({
      method: 'TerminateWorkflowExecution',
      metadata: metadata,
    }),
  };
};

export function getClusterMethods(
  cluster: string,
  requestMetadata?: GRPCMetadata
): GRPCClusterMethods {
  const methods = getClusterServicesMethods(cluster, requestMetadata);
  if (!methods) {
    throw new Error(`Invalid cluster provided: ${cluster}`);
  }
  return methods;
}
