import GRPCService, { GRPCRequestConfig } from './grpc-service';

const serviceConfiguration = {
    adminServiceConfig: {
        schemaPath: 'uber/cadence/admin/v1/service.proto',
        servicePath: 'uber.cadence.admin.v1.AdminAPI',
    },
    domainServiceConfig: {
        schemaPath: 'uber/cadence/api/v1/service_domain.proto',
        servicePath: 'uber.cadence.api.v1.DomainAPI',
    },
    visibilityServiceConfig: {
        schemaPath: 'uber/cadence/api/v1/service_visibility.proto',
        servicePath: 'uber.cadence.api.v1.VisibilityAPI',
    },
    workflowServiceConfig: {
        schemaPath: 'uber/cadence/api/v1/service_workflow.proto',
        servicePath: 'uber.cadence.api.v1.WorkflowAPI',
    },
};

const PEERS_DEFAULT = '127.0.0.1:7933';

const SERVICE_NAME_DEFAULT = 'cadence-frontend';

const peers = process.env.CADENCE_GRPC_PEERS || PEERS_DEFAULT;

const requestConfig: GRPCRequestConfig = {
    serviceName: process.env.CADENCE_GRPC_SERVICE || SERVICE_NAME_DEFAULT,
};

const adminService = new GRPCService({
    peers,
    requestConfig,
    ...serviceConfiguration.adminServiceConfig,
});
const domainService = new GRPCService({
    peers,
    requestConfig,
    ...serviceConfiguration.domainServiceConfig,
});
const visibilityService = new GRPCService({
    peers,
    requestConfig,
    ...serviceConfiguration.visibilityServiceConfig,
});
const workflowService = new GRPCService({
    peers,
    requestConfig,
    ...serviceConfiguration.workflowServiceConfig,
});

export default {
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
