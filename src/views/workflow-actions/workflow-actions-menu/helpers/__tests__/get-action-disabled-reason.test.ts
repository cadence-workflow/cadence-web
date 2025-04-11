import WORKFLOW_ACTIONS_DISABLED_REASONS_CONFIG from '../../../config/workflow-actions-disabled-reasons.config';
import WORKFLOW_ACTIONS_NON_RUNNABLE_REASONS_CONFIG from '../../../config/workflow-actions-non-runnable-reasons.config';
import getActionDisabledReason from '../get-action-disabled-reason';

describe(getActionDisabledReason.name, () => {
  it('returns undefined when action is enabled and runnable', () => {
    const result = getActionDisabledReason({
      actionEnabledConfig: 'ENABLED',
      actionRunnableStatus: 'RUNNABLE',
    });

    expect(result).toBeUndefined();
  });

  it('returns undefined when workflow status is not loaded', () => {
    const result = getActionDisabledReason({
      actionEnabledConfig: 'ENABLED',
      actionRunnableStatus: undefined,
    });

    expect(result).toBeUndefined();
  });

  it('returns disabled message when config is not loaded', () => {
    const result = getActionDisabledReason({
      actionEnabledConfig: undefined,
      actionRunnableStatus: 'RUNNABLE',
    });

    expect(result).toBe(
      WORKFLOW_ACTIONS_DISABLED_REASONS_CONFIG.DISABLED_DEFAULT
    );
  });

  it('returns disabled label when action is disabled from config', () => {
    const result = getActionDisabledReason({
      actionEnabledConfig: 'DISABLED_DEFAULT',
      actionRunnableStatus: 'RUNNABLE',
    });

    expect(result).toBe(
      WORKFLOW_ACTIONS_DISABLED_REASONS_CONFIG.DISABLED_DEFAULT
    );
  });

  it('returns unauthorized label when action is unauthorized', () => {
    const result = getActionDisabledReason({
      actionEnabledConfig: 'DISABLED_UNAUTHORIZED',
      actionRunnableStatus: 'RUNNABLE',
    });

    expect(result).toBe(
      WORKFLOW_ACTIONS_DISABLED_REASONS_CONFIG.DISABLED_UNAUTHORIZED
    );
  });

  it('returns workflow closed label when workflow is not runnable because of being closed', () => {
    const result = getActionDisabledReason({
      actionEnabledConfig: 'ENABLED',
      actionRunnableStatus: 'NOT_RUNNABLE_WORKFLOW_CLOSED',
    });

    expect(result).toBe(
      WORKFLOW_ACTIONS_NON_RUNNABLE_REASONS_CONFIG.NOT_RUNNABLE_WORKFLOW_CLOSED
    );
  });
});
