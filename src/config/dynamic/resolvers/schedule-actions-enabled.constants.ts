import { type ScheduleActionsEnabledConfig } from './schedule-actions-enabled.types';

export const AUTHORIZED_SCHEDULE_ACTIONS_CONFIG: ScheduleActionsEnabledConfig =
  {
    pause: 'ENABLED',
    resume: 'ENABLED',
    delete: 'ENABLED',
    backfill: 'ENABLED',
  };

export const UNAUTHORIZED_SCHEDULE_ACTIONS_CONFIG: ScheduleActionsEnabledConfig =
  {
    pause: 'DISABLED_UNAUTHORIZED',
    resume: 'DISABLED_UNAUTHORIZED',
    delete: 'DISABLED_UNAUTHORIZED',
    backfill: 'DISABLED_UNAUTHORIZED',
  };

export const DEFAULT_DISABLED_SCHEDULE_ACTIONS_CONFIG: ScheduleActionsEnabledConfig =
  {
    pause: 'DISABLED_DEFAULT',
    resume: 'DISABLED_DEFAULT',
    delete: 'DISABLED_DEFAULT',
    backfill: 'DISABLED_DEFAULT',
  };
