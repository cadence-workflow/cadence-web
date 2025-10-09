import { type DescribeClusterRequest__Input } from '@/__generated__/proto-ts/uber/cadence/admin/v1/DescribeClusterRequest';
import { type DescribeClusterResponse } from '@/__generated__/proto-ts/uber/cadence/admin/v1/DescribeClusterResponse';
import { type DescribeWorkflowExecutionRequest__Input } from '@/__generated__/proto-ts/uber/cadence/admin/v1/DescribeWorkflowExecutionRequest';
import { type DescribeDomainRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeDomainRequest';
import { type DescribeDomainResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeDomainResponse';
import { type DescribeTaskListRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeTaskListRequest';
import { type DescribeTaskListResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeTaskListResponse';
import { type DescribeWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeWorkflowExecutionResponse';
import { type DiagnoseWorkflowExecutionRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/DiagnoseWorkflowExecutionRequest';
import { type DiagnoseWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/DiagnoseWorkflowExecutionResponse';
import { type GetSearchAttributesRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/GetSearchAttributesRequest';
import { type GetSearchAttributesResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/GetSearchAttributesResponse';
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
import { type RequestCancelWorkflowExecutionRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/RequestCancelWorkflowExecutionRequest';
import { type RequestCancelWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/RequestCancelWorkflowExecutionResponse';
import { type ResetWorkflowExecutionRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/ResetWorkflowExecutionRequest';
import { type ResetWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/ResetWorkflowExecutionResponse';
import { type RestartWorkflowExecutionRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/RestartWorkflowExecutionRequest';
import { type RestartWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/RestartWorkflowExecutionResponse';
import { type SignalWorkflowExecutionRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/SignalWorkflowExecutionRequest';
import { type SignalWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/SignalWorkflowExecutionResponse';
import { type StartWorkflowExecutionRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/StartWorkflowExecutionRequest';
import { type StartWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/StartWorkflowExecutionResponse';
import { type TerminateWorkflowExecutionRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/TerminateWorkflowExecutionRequest';
import { type TerminateWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/TerminateWorkflowExecutionResponse';
import { type UpdateDomainRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/UpdateDomainRequest';
import { type UpdateDomainResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/UpdateDomainResponse';
import { type ClusterConfig } from '@/config/dynamic/resolvers/clusters.types';

import grpcServiceConfigurations from '../../config/grpc/grpc-services-config';
import getConfigValue from '../config/get-config-value';
import GlobalRef from '../global-ref';

import GRPCService, {
  type GRPCMetadata,
  type GRPCRequestConfig,
} from './grpc-service';
type ClusterService = Record<
  'adminService' | 'domainService' | 'visibilityService' | 'workflowService',
  GRPCService
>;
type ClustersServices = Record<string, ClusterService>;
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
  getSearchAttributes: (
    payload: GetSearchAttributesRequest__Input
  ) => Promise<GetSearchAttributesResponse>;
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
  requestCancelWorkflow: (
    payload: RequestCancelWorkflowExecutionRequest__Input
  ) => Promise<RequestCancelWorkflowExecutionResponse>;
  restartWorkflow: (
    payload: RestartWorkflowExecutionRequest__Input
  ) => Promise<RestartWorkflowExecutionResponse>;
  resetWorkflow: (
    payload: ResetWorkflowExecutionRequest__Input
  ) => Promise<ResetWorkflowExecutionResponse>;
  startWorkflow: (
    payload: StartWorkflowExecutionRequest__Input
  ) => Promise<StartWorkflowExecutionResponse>;
  getDiagnosticsWorkflow: (
    payload: DiagnoseWorkflowExecutionRequest__Input
  ) => Promise<DiagnoseWorkflowExecutionResponse>;
};

// cache services instances
const clusterServicesMapGlobalRef = new GlobalRef<ClustersServices>(
  'cluster-services-map',
  {}
);
const clusterServicesMap: ClustersServices = clusterServicesMapGlobalRef.value;

const getClusterServices = async (c: ClusterConfig) => {
  if (clusterServicesMap[c.clusterName]) {
    return clusterServicesMap[c.clusterName];
  }

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

  const services: ClusterService = {
    adminService,
    domainService,
    visibilityService,
    workflowService,
  };
  // add service to cache (clusterServicesMap)
  clusterServicesMap[c.clusterName] = services;
  return services;
};

const getAllClustersServices = async () => {
  const CLUSTERS_CONFIGS = await getConfigValue('CLUSTERS');
  const clustersServices: ClustersServices = {};

  for (const c of CLUSTERS_CONFIGS) {
    clustersServices[c.clusterName] = await getClusterServices(c);
  }
  return clustersServices;
};

const getClusterServicesMethods = async (
  c: string,
  metadata?: GRPCMetadata
): Promise<GRPCClusterMethods> => {
  const clusterServices = await getAllClustersServices();
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
    getSearchAttributes: visibilityService.request<
      GetSearchAttributesRequest__Input,
      GetSearchAttributesResponse
    >({
      method: 'GetSearchAttributes',
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
    requestCancelWorkflow: workflowService.request<
      RequestCancelWorkflowExecutionRequest__Input,
      RequestCancelWorkflowExecutionResponse
    >({
      method: 'RequestCancelWorkflowExecution',
      metadata: metadata,
    }),
    restartWorkflow: workflowService.request<
      RestartWorkflowExecutionRequest__Input,
      RestartWorkflowExecutionResponse
    >({
      method: 'RestartWorkflowExecution',
      metadata: metadata,
    }),
    resetWorkflow: workflowService.request<
      ResetWorkflowExecutionRequest__Input,
      ResetWorkflowExecutionResponse
    >({
      method: 'ResetWorkflowExecution',
      metadata: metadata,
    }),
    startWorkflow: workflowService.request<
      StartWorkflowExecutionRequest__Input,
      StartWorkflowExecutionResponse
    >({
      method: 'StartWorkflowExecution',
      metadata: metadata,
    }),
    getDiagnosticsWorkflow: workflowService.request<
      DiagnoseWorkflowExecutionRequest__Input,
      DiagnoseWorkflowExecutionResponse
    >({
      method: 'DiagnoseWorkflowExecution',
      metadata: metadata,
    }),
  };
};

export async function getClusterMethods(
  cluster: string,
  requestMetadata?: GRPCMetadata
): Promise<GRPCClusterMethods> {
  const methods = await getClusterServicesMethods(cluster, requestMetadata);
  if (!methods) {
    throw new Error(`Invalid cluster provided: ${cluster}`);
  }
  return methods;
}
