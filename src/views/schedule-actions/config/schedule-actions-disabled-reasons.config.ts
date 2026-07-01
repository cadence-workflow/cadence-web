import { type ScheduleActionDisabledValue } from '@/config/dynamic/resolvers/schedule-actions-enabled.types';

const SCHEDULE_ACTIONS_DISABLED_REASONS_CONFIG = {
  DISABLED_DEFAULT: 'Schedule action has been disabled',
  DISABLED_UNAUTHORIZED: 'Not authorized to perform this action',
} as const satisfies Record<ScheduleActionDisabledValue, string>;

export default SCHEDULE_ACTIONS_DISABLED_REASONS_CONFIG;
