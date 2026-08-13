import SCHEDULE_ACTIONS_DISABLED_REASONS_CONFIG from '../../../config/schedule-actions-disabled-reasons.config';
import SCHEDULE_ACTIONS_NON_RUNNABLE_REASONS_CONFIG from '../../../config/schedule-actions-non-runnable-reasons.config';
import getActionDisabledReason from '../get-action-disabled-reason';

describe(getActionDisabledReason.name, () => {
  it('returns undefined when action is enabled and runnable', () => {
    expect(
      getActionDisabledReason({
        actionEnabledConfig: 'ENABLED',
        actionRunnableStatus: 'RUNNABLE',
      })
    ).toBeUndefined();
  });

  it('returns reason when action is disabled by default', () => {
    expect(
      getActionDisabledReason({
        actionEnabledConfig: 'DISABLED_DEFAULT',
        actionRunnableStatus: 'RUNNABLE',
      })
    ).toBe(SCHEDULE_ACTIONS_DISABLED_REASONS_CONFIG.DISABLED_DEFAULT);
  });

  it('returns reason when action is disabled due to unauthorized access', () => {
    expect(
      getActionDisabledReason({
        actionEnabledConfig: 'DISABLED_UNAUTHORIZED',
        actionRunnableStatus: 'RUNNABLE',
      })
    ).toBe(SCHEDULE_ACTIONS_DISABLED_REASONS_CONFIG.DISABLED_UNAUTHORIZED);
  });

  it('returns disabled reason over non-runnable reason when both apply', () => {
    expect(
      getActionDisabledReason({
        actionEnabledConfig: 'DISABLED_DEFAULT',
        actionRunnableStatus: 'NOT_RUNNABLE_SCHEDULE_ALREADY_PAUSED',
      })
    ).toBe(SCHEDULE_ACTIONS_DISABLED_REASONS_CONFIG.DISABLED_DEFAULT);
  });

  it('returns reason when schedule is already paused', () => {
    expect(
      getActionDisabledReason({
        actionEnabledConfig: 'ENABLED',
        actionRunnableStatus: 'NOT_RUNNABLE_SCHEDULE_ALREADY_PAUSED',
      })
    ).toBe(
      SCHEDULE_ACTIONS_NON_RUNNABLE_REASONS_CONFIG.NOT_RUNNABLE_SCHEDULE_ALREADY_PAUSED
    );
  });

  it('returns reason when schedule is not paused', () => {
    expect(
      getActionDisabledReason({
        actionEnabledConfig: 'ENABLED',
        actionRunnableStatus: 'NOT_RUNNABLE_SCHEDULE_NOT_PAUSED',
      })
    ).toBe(
      SCHEDULE_ACTIONS_NON_RUNNABLE_REASONS_CONFIG.NOT_RUNNABLE_SCHEDULE_NOT_PAUSED
    );
  });

  it('returns disabled default reason when no config is provided', () => {
    expect(
      getActionDisabledReason({
        actionRunnableStatus: 'RUNNABLE',
      })
    ).toBe(SCHEDULE_ACTIONS_DISABLED_REASONS_CONFIG.DISABLED_DEFAULT);
  });

  it('returns undefined when schedule is loading and action is enabled', () => {
    expect(
      getActionDisabledReason({
        actionEnabledConfig: 'ENABLED',
        actionRunnableStatus: undefined,
      })
    ).toBeUndefined();
  });

  it('returns disabled reason when schedule is loading and action is disabled from config', () => {
    expect(
      getActionDisabledReason({
        actionEnabledConfig: 'DISABLED_UNAUTHORIZED',
        actionRunnableStatus: undefined,
      })
    ).toBe(SCHEDULE_ACTIONS_DISABLED_REASONS_CONFIG.DISABLED_UNAUTHORIZED);
  });

  it('returns disabled default reason when config is not loaded', () => {
    expect(
      getActionDisabledReason({
        actionEnabledConfig: undefined,
        actionRunnableStatus: undefined,
      })
    ).toBe(SCHEDULE_ACTIONS_DISABLED_REASONS_CONFIG.DISABLED_DEFAULT);
  });
});
