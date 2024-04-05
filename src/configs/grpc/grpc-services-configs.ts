const GRPC_SERVICES_CONFIGS = {
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

export default GRPC_SERVICES_CONFIGS;