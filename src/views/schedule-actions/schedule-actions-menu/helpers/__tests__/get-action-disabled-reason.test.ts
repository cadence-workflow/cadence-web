import { type ScheduleActionEnabledConfigValue } from '@/config/dynamic/resolvers/schedule-actions-enabled.types';

import { type ScheduleActionRunnableStatus } from '../../../schedule-actions.types';
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
    ).toBe('Schedule action has been disabled');
  });

  it('returns reason when action is disabled due to unauthorized access', () => {
    expect(
      getActionDisabledReason({
        actionEnabledConfig: 'DISABLED_UNAUTHORIZED',
        actionRunnableStatus: 'RUNNABLE',
      })
    ).toBe('Not authorized to perform this action');
  });

  it('returns disabled reason over non-runnable reason when both apply', () => {
    expect(
      getActionDisabledReason({
        actionEnabledConfig: 'DISABLED_DEFAULT',
        actionRunnableStatus: 'NOT_RUNNABLE_SCHEDULE_ALREADY_PAUSED',
      })
    ).toBe('Schedule action has been disabled');
  });

  it('returns reason when schedule is already paused', () => {
    expect(
      getActionDisabledReason({
        actionEnabledConfig: 'ENABLED',
        actionRunnableStatus: 'NOT_RUNNABLE_SCHEDULE_ALREADY_PAUSED',
      })
    ).toBe('Schedule is already paused');
  });

  it('returns reason when schedule is not paused', () => {
    expect(
      getActionDisabledReason({
        actionEnabledConfig: 'ENABLED',
        actionRunnableStatus: 'NOT_RUNNABLE_SCHEDULE_NOT_PAUSED',
      })
    ).toBe('Schedule is not paused');
  });

  it('returns disabled default reason when no config is provided', () => {
    expect(
      getActionDisabledReason({
        actionRunnableStatus: 'RUNNABLE',
      })
    ).toBe('Schedule action has been disabled');
  });

  it('returns undefined when runnable status is not provided', () => {
    expect(
      getActionDisabledReason({
        actionEnabledConfig: 'ENABLED',
        actionRunnableStatus: undefined as
          | ScheduleActionRunnableStatus
          | undefined,
      })
    ).toBeUndefined();
  });

  it('returns undefined when neither config nor runnable status is provided', () => {
    expect(
      getActionDisabledReason({
        actionEnabledConfig: undefined as
          | ScheduleActionEnabledConfigValue
          | undefined,
        actionRunnableStatus: undefined as
          | ScheduleActionRunnableStatus
          | undefined,
      })
    ).toBeUndefined();
  });
});
