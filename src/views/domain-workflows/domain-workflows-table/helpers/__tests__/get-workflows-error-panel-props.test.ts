import getWorkflowsErrorPanelProps from '../get-workflows-error-panel-props';

describe(getWorkflowsErrorPanelProps.name, () => {
  it('returns default error panel props for regular error', () => {
    expect(
      getWorkflowsErrorPanelProps({
        error: new Error('Test error'),
        areSearchParamsAbsent: false,
      })
    ).toEqual({
      message: 'Failed to fetch workflows',
      actions: [{ kind: 'retry', label: 'Retry' }],
    });
  });

  it('returns "not found" error panel props when search params are absent', () => {
    expect(
      getWorkflowsErrorPanelProps({
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

  it('returns undefined in all other cases', () => {
    expect(
      getWorkflowsErrorPanelProps({
        error: null,
        areSearchParamsAbsent: false,
      })
    ).toBeUndefined();
  });
});
