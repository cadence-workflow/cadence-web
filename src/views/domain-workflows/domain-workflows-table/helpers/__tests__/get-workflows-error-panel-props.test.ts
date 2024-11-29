import { RequestError } from '@/utils/request/request-error';

import getWorkflowsErrorPanelProps from '../get-workflows-error-panel-props';

describe(getWorkflowsErrorPanelProps.name, () => {
  it('returns default error panel props for regular error', () => {
    expect(
      getWorkflowsErrorPanelProps({
        inputType: 'search',
        error: new RequestError('Test error', 500),
        areSearchParamsAbsent: false,
      })
    ).toEqual({
      message: 'Failed to fetch workflows',
      actions: [{ kind: 'retry', label: 'Retry' }],
    });
  });

  it('returns error message directly for bad request error for queries', () => {
    expect(
      getWorkflowsErrorPanelProps({
        inputType: 'query',
        error: new RequestError('Incorrect query', 400),
        areSearchParamsAbsent: false,
      })
    ).toEqual({
      message: 'Error in query: Incorrect query',
    });
  });

  it('returns "not found" error panel props when search params are absent in search mode', () => {
    expect(
      getWorkflowsErrorPanelProps({
        inputType: 'search',
        error: null,
        areSearchParamsAbsent: true,
      })
    ).toEqual({
      message: 'No workflows found for this domain',
      omitLogging: true,
      actions: [
        {
          kind: 'link-external',
          label: 'Get started on workflows',
          link: 'https://cadenceworkflow.io/docs/concepts/workflows',
        },
      ],
    });
  });

  it('returns undefined when search params are absent in query mode', () => {
    expect(
      getWorkflowsErrorPanelProps({
        inputType: 'query',
        error: null,
        areSearchParamsAbsent: true,
      })
    ).toEqual(undefined);
  });

  it('returns undefined in all other cases', () => {
    expect(
      getWorkflowsErrorPanelProps({
        inputType: 'search',
        error: null,
        areSearchParamsAbsent: false,
      })
    ).toBeUndefined();
  });
});
