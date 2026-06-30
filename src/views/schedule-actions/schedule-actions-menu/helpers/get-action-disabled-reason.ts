import SCHEDULE_ACTIONS_NON_RUNNABLE_REASONS_CONFIG from '../../config/schedule-actions-non-runnable-reasons.config';
import { type ScheduleActionRunnableStatus } from '../../schedule-actions.types';

export default function getActionDisabledReason({
  actionRunnableStatus,
}: {
  actionRunnableStatus?: ScheduleActionRunnableStatus;
}): string | undefined {
  if (!actionRunnableStatus) {
    return undefined;
  }

  if (actionRunnableStatus !== 'RUNNABLE') {
    return SCHEDULE_ACTIONS_NON_RUNNABLE_REASONS_CONFIG[actionRunnableStatus];
  }

  return undefined;
}
