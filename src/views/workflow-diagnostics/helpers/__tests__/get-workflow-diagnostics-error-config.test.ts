import {
  DIAGNOSTICS_CONFIG_DISABLED_ERROR_MSG,
  DIAGNOSTICS_RUNNING_WORKFLOW_ERROR_MSG,
} from '../../workflow-diagnostics.constants';
import getWorkflowDiagnosticsErrorConfig from '../get-workflow-diagnostics-error-config';

jest.mock('@/views/workflow-page/helpers/get-workflow-page-error-config', () =>
  jest.fn(() => ({
    message: 'Failed to load workflow diagnostics',
  }))
);

describe(getWorkflowDiagnosticsErrorConfig.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns diagnostics disabled error config when error message matches DIAGNOSTICS_CONFIG_DISABLED_ERROR_MSG', () => {
    const error = new Error(DIAGNOSTICS_CONFIG_DISABLED_ERROR_MSG);

    const result = getWorkflowDiagnosticsErrorConfig(error);

    expect(result).toEqual({
      message: 'Workflow Diagnostics is currently disabled',
      omitLogging: true,
      actions: [
        {
          kind: 'link-internal',
          link: './summary',
          label: 'Go to workflow summary',
        },
      ],
    });
  });

  it('returns running workflow error config when error message matches DIAGNOSTICS_RUNNING_WORKFLOW_ERROR_MSG', () => {
    const error = new Error(DIAGNOSTICS_RUNNING_WORKFLOW_ERROR_MSG);

    const result = getWorkflowDiagnosticsErrorConfig(error);

    expect(result).toEqual({
      message: 'Cannot load diagnostics for a running workflow',
      omitLogging: true,
      actions: [
        {
          kind: 'retry',
          label: 'Retry',
        },
        {
          kind: 'link-internal',
          link: './summary',
          label: 'Go to workflow summary',
        },
      ],
    });
  });

  it('returns result from getWorkflowPageErrorConfig for other errors', () => {
    const error = new Error('Some other error');

    const result = getWorkflowDiagnosticsErrorConfig(error);

    expect(result).toEqual({ message: 'Failed to load workflow diagnostics' });
  });
});
