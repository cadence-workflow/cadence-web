import { type DescribeClusterRequest__Input } from '@/__generated__/proto-ts/uber/cadence/admin/v1/DescribeClusterRequest';
import { type DescribeClusterResponse } from '@/__generated__/proto-ts/uber/cadence/admin/v1/DescribeClusterResponse';
import { type DescribeWorkflowExecutionRequest__Input } from '@/__generated__/proto-ts/uber/cadence/admin/v1/DescribeWorkflowExecutionRequest';
import { type DescribeWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/admin/v1/DescribeWorkflowExecutionResponse';
import { type DescribeDomainRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeDomainRequest';
import { type DescribeDomainResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeDomainResponse';
import { type DescribeTaskListRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeTaskListRequest';
import { type DescribeTaskListResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeTaskListResponse';
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
import CLUSTERS_CONFIGS from '@/config/clusters/clusters.config';

import grpcServiceConfigurations from '../../config/grpc/grpc-services-config';

import GRPCService, { type GRPCRequestConfig } from './grpc-service';

const clusterServicesMethods = CLUSTERS_CONFIGS.reduce(
  (result, c) => {
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
      archivedWorkflows: visibilityService.request<
        ListArchivedWorkflowExecutionsRequest__Input,
        ListArchivedWorkflowExecutionsResponse
      >({
        method: 'ListArchivedWorkflowExecutions',
        //formatResponse: formatResponseWorkflowList,
        //transform: combine(withDomain(ctx), withPagination(ctx)),
      }),
      closedWorkflows: visibilityService.request<
        ListClosedWorkflowExecutionsRequest__Input,
        ListClosedWorkflowExecutionsResponse
      >({
        method: 'ListClosedWorkflowExecutions',
        // formatRequest: formatRequestWorkflowList,
        // formatResponse: formatResponseWorkflowList,
        // transform: combine(withDomain(ctx), withPagination(ctx)),
      }),
      describeCluster: adminService.request<
        DescribeClusterRequest__Input,
        DescribeClusterResponse
      >({
        method: 'DescribeCluster',
      }),
      describeDomain: domainService.request<
        DescribeDomainRequest__Input,
        DescribeDomainResponse
      >({
        method: 'DescribeDomain',
        // formatResponse: formatResponseDomain,
      }),
      describeTaskList: workflowService.request<
        DescribeTaskListRequest__Input,
        DescribeTaskListResponse
      >({
        // formatRequest: formatRequestDescribeTaskList,
        // formatResponse: formatResponseDescribeTaskList,
        method: 'DescribeTaskList',
      }),
      describeWorkflow: workflowService.request<
        DescribeWorkflowExecutionRequest__Input,
        DescribeWorkflowExecutionResponse
      >({
        method: 'DescribeWorkflowExecution',
        //formatResponse: formatResponseDescribeWorkflow,
        //transform: combine(withDomain(ctx), withWorkflowExecution(ctx)),
      }),
      exportHistory: workflowService.request<
        GetWorkflowExecutionHistoryRequest__Input,
        GetWorkflowExecutionHistoryResponse
      >({
        method: 'GetWorkflowExecutionHistory',
        //formatRequest: formatRequestGetHistory,
        //formatResponse: formatResponseExportHistory,
        /* transform: combine(
              withDomain(ctx),
              withPagination(ctx),
              withWorkflowExecution(ctx)
            ), */
      }),
      getHistory: workflowService.request<
        GetWorkflowExecutionHistoryRequest__Input,
        GetWorkflowExecutionHistoryResponse
      >({
        method: 'GetWorkflowExecutionHistory',
        /* formatRequest: formatRequestGetHistory,
            formatResponse: formatResponseGetHistory,
            transform: combine(
                withDomain(ctx),
                withPagination(ctx),
                withWorkflowExecution(ctx)
            ), */
      }),
      listDomains: domainService.request<
        ListDomainsRequest__Input,
        ListDomainsResponse
      >({
        method: 'ListDomains',
        //formatResponse: formatResponseListDomains,
      }),
      listTaskListPartitions: workflowService.request<
        ListTaskListPartitionsRequest__Input,
        ListTaskListPartitionsResponse
      >({
        method: 'ListTaskListPartitions',
      }),
      listWorkflows: visibilityService.request<
        ListWorkflowExecutionsRequest__Input,
        ListWorkflowExecutionsResponse
      >({
        method: 'ListWorkflowExecutions',
        /* formatResponse: formatResponseWorkflowList,
             transform: combine(withDomain(ctx), withPagination(ctx)), */
      }),
      openWorkflows: visibilityService.request<
        ListOpenWorkflowExecutionsRequest__Input,
        ListOpenWorkflowExecutionsResponse
      >({
        method: 'ListOpenWorkflowExecutions',
        /* formatRequest: formatRequestWorkflowList,
            formatResponse: formatResponseWorkflowList,
            transform: combine(withDomain(ctx), withPagination(ctx)), */
      }),
      queryWorkflow: workflowService.request<
        QueryWorkflowRequest__Input,
        QueryWorkflowResponse
      >({
        method: 'QueryWorkflow',
        /* formatResponse: formatResponseQueryWorkflow,
            transform: combine(withDomain(ctx), withWorkflowExecution(ctx)), */
      }),
      signalWorkflow: workflowService.request<
        SignalWorkflowExecutionRequest__Input,
        SignalWorkflowExecutionResponse
      >({
        method: 'SignalWorkflowExecution',
        /* formatResponse: formatResponseSignalWorkflowExecution,
            transform: combine(withDomain(ctx), withWorkflowExecution(ctx)), */
      }),
      terminateWorkflow: workflowService.request<
        TerminateWorkflowExecutionRequest__Input,
        TerminateWorkflowExecutionResponse
      >({
        method: 'TerminateWorkflowExecution',
        /* formatResponse: formatResponseTerminateWorkflowExecution,
            transform: combine(withDomain(ctx), withWorkflowExecution(ctx)), */
      }),
    };
    result[c.clusterName].describeWorkflow;
    return result;
  },
  {} as {
    [k: string]: {
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
  }
);

export const clusterMethods = clusterServicesMethods;

export function getClusterMethods(
  cluster: string
): (typeof clusterMethods)[string] {
  const methods = clusterMethods[cluster];
  if (!methods) {
    throw new Error('Invalid cluster provided');
  }
  return methods;
}
