import { RequestError } from '@/utils/request/request-error';

import getWorkflowPageErrorConfig from '../get-workflow-page-error-config';

describe('getWorkflowPageErrorConfig', () => {
  it('returns default error config for regular error', () => {
    expect(
      getWorkflowPageErrorConfig(new Error('Test error'), 'default error')
    ).toEqual({
      message: 'default error',
      actions: [{ kind: 'retry', label: 'Retry' }],
    });
  });

  it('returns "Workflow not found" error config when request errors with 404', () => {
    expect(
      getWorkflowPageErrorConfig(new RequestError('test error', 404))
    ).toEqual({
      message: 'Workflow not found',
      omitLogging: true,
      actions: [{ kind: 'retry', label: 'Retry' }],
    });
  });

  it('returns correct error config when request errors with 403', () => {
    expect(
      getWorkflowPageErrorConfig(
        new RequestError('test error', 403),
        undefined,
        'current tab'
      )
    ).toEqual({
      message: `Access denied, can't fetch current tab`,
      omitLogging: true,
    });
  });
});
