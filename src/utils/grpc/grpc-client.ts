import GRPCService, { GRPCRequestConfig } from './grpc-service';
import grpcServiceConfigurations from '../../config/grpc/grpc-services-config';
import CLUSTERS_CONFIGS from '@/config/clusters/clusters.config';


const clusterServicesMethods = CLUSTERS_CONFIGS.reduce((result, c) => {
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
        archivedWorkflows: visibilityService.request({
            method: 'ListArchivedWorkflowExecutions',
            //formatResponse: formatResponseWorkflowList,
            //transform: combine(withDomain(ctx), withPagination(ctx)),
        }),
        closedWorkflows: visibilityService.request({
            method: 'ListClosedWorkflowExecutions',
            // formatRequest: formatRequestWorkflowList,
            // formatResponse: formatResponseWorkflowList,
            // transform: combine(withDomain(ctx), withPagination(ctx)),
        }),
        describeCluster: adminService.request({
            method: 'DescribeCluster',
        }),
        describeDomain: domainService.request({
            method: 'DescribeDomain',
            // formatResponse: formatResponseDomain,
        }),
        describeTaskList: workflowService.request({
            // formatRequest: formatRequestDescribeTaskList,
            // formatResponse: formatResponseDescribeTaskList,
            method: 'DescribeTaskList',
        }),
        describeWorkflow: workflowService.request({
            method: 'DescribeWorkflowExecution',
            //formatResponse: formatResponseDescribeWorkflow,
            //transform: combine(withDomain(ctx), withWorkflowExecution(ctx)),
        }),
        exportHistory: workflowService.request({
            method: 'GetWorkflowExecutionHistory',
            //formatRequest: formatRequestGetHistory,
            //formatResponse: formatResponseExportHistory,
            /* transform: combine(
              withDomain(ctx),
              withPagination(ctx),
              withWorkflowExecution(ctx)
            ), */
        }),
        getHistory: workflowService.request({
            method: 'GetWorkflowExecutionHistory',
            /* formatRequest: formatRequestGetHistory,
            formatResponse: formatResponseGetHistory,
            transform: combine(
                withDomain(ctx),
                withPagination(ctx),
                withWorkflowExecution(ctx)
            ), */
        }),
        listDomains: domainService.request({
            method: 'ListDomains',
            //formatResponse: formatResponseListDomains,
        }),
        listTaskListPartitions: workflowService.request({
            method: 'ListTaskListPartitions',
        }),
        listWorkflows: visibilityService.request({
            method: 'ListWorkflowExecutions',
            /* formatResponse: formatResponseWorkflowList,
             transform: combine(withDomain(ctx), withPagination(ctx)), */
        }),
        openWorkflows: visibilityService.request({
            method: 'ListOpenWorkflowExecutions',
            /* formatRequest: formatRequestWorkflowList,
            formatResponse: formatResponseWorkflowList,
            transform: combine(withDomain(ctx), withPagination(ctx)), */
        }),
        queryWorkflow: workflowService.request({
            method: 'QueryWorkflow',
            /* formatResponse: formatResponseQueryWorkflow,
            transform: combine(withDomain(ctx), withWorkflowExecution(ctx)), */
        }),
        signalWorkflow: workflowService.request({
            method: 'SignalWorkflowExecution',
            /* formatResponse: formatResponseSignalWorkflowExecution,
            transform: combine(withDomain(ctx), withWorkflowExecution(ctx)), */
        }),
        terminateWorkflow: workflowService.request({
            method: 'TerminateWorkflowExecution',
            /* formatResponse: formatResponseTerminateWorkflowExecution,
            transform: combine(withDomain(ctx), withWorkflowExecution(ctx)), */
        }),
    }
    return result;
}, {} as { [k: string]: any })

export const clusterMethods = clusterServicesMethods;
