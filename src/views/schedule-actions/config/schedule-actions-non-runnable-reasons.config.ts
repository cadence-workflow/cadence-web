import { type ScheduleActionNonRunnableStatus } from '../schedule-actions.types';

const SCHEDULE_ACTIONS_NON_RUNNABLE_REASONS_CONFIG = {
  NOT_RUNNABLE_SCHEDULE_ALREADY_PAUSED: 'Schedule is already paused',
  NOT_RUNNABLE_SCHEDULE_NOT_PAUSED: 'Schedule is not paused',
} as const satisfies Record<ScheduleActionNonRunnableStatus, string>;

export default SCHEDULE_ACTIONS_NON_RUNNABLE_REASONS_CONFIG;
