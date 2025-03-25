import {
  WORKFLOW_ACTION_DISABLED_LABELS,
  WORKFLOW_ACTION_RUN_STATUS_LABELS,
} from '../../workflow-actions-menu.constants';
import getActionDisabledReason from '../get-action-disabled-reason';

describe(getActionDisabledReason.name, () => {
  it('returns undefined when action is enabled and runnable', () => {
    const result = getActionDisabledReason({
      actionEnabledConfig: 'ENABLED',
      actionRunStatus: 'RUNNABLE',
    });

    expect(result).toBeUndefined();
  });

  it('returns loading message when config is not loaded', () => {
    const result = getActionDisabledReason({
      actionEnabledConfig: undefined,
      actionRunStatus: 'RUNNABLE',
    });

    expect(result).toBe('Workflow actions config has not loaded yet');
  });

  it('returns disabled label when action is disabled from config', () => {
    const result = getActionDisabledReason({
      actionEnabledConfig: 'DISABLED_UNKNOWN',
      actionRunStatus: 'RUNNABLE',
    });

    expect(result).toBe(WORKFLOW_ACTION_DISABLED_LABELS.DISABLED_UNKNOWN);
  });

  it('returns unauthorized label when action is unauthorized', () => {
    const result = getActionDisabledReason({
      actionEnabledConfig: 'DISABLED_UNAUTHORIZED',
      actionRunStatus: 'RUNNABLE',
    });

    expect(result).toBe(WORKFLOW_ACTION_DISABLED_LABELS.DISABLED_UNAUTHORIZED);
  });

  it('returns workflow closed label when workflow is not runnable', () => {
    const result = getActionDisabledReason({
      actionEnabledConfig: 'ENABLED',
      actionRunStatus: 'NOT_RUNNABLE_WORKFLOW_CLOSED',
    });

    expect(result).toBe(
      WORKFLOW_ACTION_RUN_STATUS_LABELS.NOT_RUNNABLE_WORKFLOW_CLOSED
    );
  });
});
