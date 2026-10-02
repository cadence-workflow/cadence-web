import { type ScheduleActionEnabledConfigValue } from '@/config/dynamic/resolvers/schedule-actions-enabled.types';

import SCHEDULE_ACTIONS_DISABLED_REASONS_CONFIG from '../../config/schedule-actions-disabled-reasons.config';
import SCHEDULE_ACTIONS_NON_RUNNABLE_REASONS_CONFIG from '../../config/schedule-actions-non-runnable-reasons.config';
import { type ScheduleActionRunnableStatus } from '../../schedule-actions.types';

export default function getActionDisabledReason({
  actionEnabledConfig,
  actionRunnableStatus,
}: {
  actionEnabledConfig?: ScheduleActionEnabledConfigValue;
  actionRunnableStatus?: ScheduleActionRunnableStatus;
}): string | undefined {
  if (actionEnabledConfig !== 'ENABLED') {
    return SCHEDULE_ACTIONS_DISABLED_REASONS_CONFIG[
      actionEnabledConfig ?? 'DISABLED_DEFAULT'
    ];
  }

  if (!actionRunnableStatus) {
    return undefined;
  }

  if (actionRunnableStatus !== 'RUNNABLE') {
    return SCHEDULE_ACTIONS_NON_RUNNABLE_REASONS_CONFIG[actionRunnableStatus];
  }

  return undefined;
}
