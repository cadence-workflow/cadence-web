import { NO_WORKFLOWS_ERROR_MESSAGE } from '../../domain-workflows-table/domain-workflows-table.constants';
import getDomainWorkflowsErrorConfig from '../get-domain-workflows-error-config';

describe(getDomainWorkflowsErrorConfig.name, () => {
  it('returns default error config for regular error', () => {
    expect(getDomainWorkflowsErrorConfig(new Error('Test error'))).toEqual({
      message: 'Failed to load workflows',
      actions: [{ kind: 'retry', label: 'Retry' }],
    });
  });

  it('returns "not found" error config for workflows not found error', () => {
    expect(
      getDomainWorkflowsErrorConfig(new Error(NO_WORKFLOWS_ERROR_MESSAGE))
    ).toEqual({
      message: 'No workflows found for this domain',
      actions: [
        {
          kind: 'link-external',
          label: 'Get started on workflows',
          link: 'https://cadenceworkflow.io/docs/concepts/workflows',
        },
      ],
    });
  });
});
