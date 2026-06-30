import { type ScheduleActionRunnableStatus } from '../../../schedule-actions.types';

import getActionDisabledReason from '../get-action-disabled-reason';

describe(getActionDisabledReason.name, () => {
  it('returns undefined when action is runnable', () => {
    expect(
      getActionDisabledReason({ actionRunnableStatus: 'RUNNABLE' })
    ).toBeUndefined();
  });

  it('returns reason when schedule is already paused', () => {
    expect(
      getActionDisabledReason({
        actionRunnableStatus: 'NOT_RUNNABLE_SCHEDULE_ALREADY_PAUSED',
      })
    ).toBe('Schedule is already paused');
  });

  it('returns reason when schedule is not paused', () => {
    expect(
      getActionDisabledReason({
        actionRunnableStatus: 'NOT_RUNNABLE_SCHEDULE_NOT_PAUSED',
      })
    ).toBe('Schedule is not paused');
  });

  it('returns undefined when runnable status is not provided', () => {
    expect(
      getActionDisabledReason({
        actionRunnableStatus: undefined as ScheduleActionRunnableStatus | undefined,
      })
    ).toBeUndefined();
  });
});
