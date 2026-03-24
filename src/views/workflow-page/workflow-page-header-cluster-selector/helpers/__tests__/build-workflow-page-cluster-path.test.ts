import buildWorkflowPageClusterPath from '../build-workflow-page-cluster-path';

describe(buildWorkflowPageClusterPath.name, () => {
  it('builds path without workflow tab segment when workflowTab is omitted', () => {
    expect(
      buildWorkflowPageClusterPath({
        domain: 'my-domain',
        cluster: 'cluster_1',
        workflowId: 'wf-123',
        runId: 'run-456',
      })
    ).toBe('/domains/my-domain/cluster_1/workflows/wf-123/run-456');
  });

  it('builds path with workflow tab segment when workflowTab is provided', () => {
    expect(
      buildWorkflowPageClusterPath({
        domain: 'mock-domain',
        cluster: 'cluster_2',
        workflowId: 'workflow-123',
        runId: 'run-456',
        workflowTab: 'summary',
      })
    ).toBe(
      '/domains/mock-domain/cluster_2/workflows/workflow-123/run-456/summary'
    );
  });

  it('encodes special characters in domain and cluster', () => {
    expect(
      buildWorkflowPageClusterPath({
        domain: 'domain%20with',
        cluster: 'cluster_with_special%chars',
        workflowId: 'workflow-123',
        runId: 'run-456',
      })
    ).toBe(
      '/domains/domain%2520with/cluster_with_special%25chars/workflows/workflow-123/run-456'
    );
  });
});
