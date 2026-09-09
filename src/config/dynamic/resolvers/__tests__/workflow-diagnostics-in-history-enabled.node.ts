import workflowDiagnosticsEnabled from '../workflow-diagnostics-enabled';
import workflowDiagnosticsInHistoryEnabled from '../workflow-diagnostics-in-history-enabled';

jest.mock('../workflow-diagnostics-enabled', () => jest.fn());

const mockWorkflowDiagnosticsEnabled = jest.mocked(workflowDiagnosticsEnabled);

describe(workflowDiagnosticsInHistoryEnabled.name, () => {
  const originalValue =
    process.env.CADENCE_WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (originalValue === undefined) {
      delete process.env.CADENCE_WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED;
    } else {
      process.env.CADENCE_WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED =
        originalValue;
    }
  });

  it('returns true when the env variable is set and workflow diagnostics are enabled', async () => {
    process.env.CADENCE_WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED = 'true';
    mockWorkflowDiagnosticsEnabled.mockResolvedValue(true);

    expect(await workflowDiagnosticsInHistoryEnabled()).toBe(true);
    expect(mockWorkflowDiagnosticsEnabled).toHaveBeenCalledTimes(1);
  });

  it('returns false when the env variable is unset', async () => {
    delete process.env.CADENCE_WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED;

    expect(await workflowDiagnosticsInHistoryEnabled()).toBe(false);
    expect(mockWorkflowDiagnosticsEnabled).not.toHaveBeenCalled();
  });

  it('returns false when the env variable is not "true"', async () => {
    process.env.CADENCE_WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED = 'false';

    expect(await workflowDiagnosticsInHistoryEnabled()).toBe(false);
    expect(mockWorkflowDiagnosticsEnabled).not.toHaveBeenCalled();
  });

  it('returns false when workflow diagnostics are disabled', async () => {
    process.env.CADENCE_WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED = 'true';
    mockWorkflowDiagnosticsEnabled.mockResolvedValue(false);

    expect(await workflowDiagnosticsInHistoryEnabled()).toBe(false);
  });
});
