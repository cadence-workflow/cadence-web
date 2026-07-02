import type SCHEDULE_ACTIONS_DISABLED_VALUES_CONFIG from './schedule-actions-disabled-values.config';

export type ScheduleActionID = 'pause' | 'resume' | 'delete';

export type ScheduleActionDisabledValue =
  (typeof SCHEDULE_ACTIONS_DISABLED_VALUES_CONFIG)[number];

export type ScheduleActionEnabledConfigValue =
  | 'ENABLED'
  | ScheduleActionDisabledValue;

export type ScheduleActionsEnabledConfig = Record<
  ScheduleActionID,
  ScheduleActionEnabledConfigValue
>;

export type ScheduleActionsEnabledResolverParams = {
  domain: string;
  cluster: string;
};
