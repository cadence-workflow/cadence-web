import { CRON_VALIDATE_CADENCE_PRESET } from '@/utils/cron-validate/cron-validate.constants';
import { type CronData } from '@/utils/cron-validate/cron-validate.types';

import type { CronFieldConfig } from './cron-schedule-input.types';

export const CRON_FIELD_ORDER = [
  'minutes',
  'hours',
  'daysOfMonth',
  'months',
  'daysOfWeek',
] as const satisfies (keyof CronData)[];

export const CRON_FIELD_CONFIGS: Record<string, CronFieldConfig> = {
  minutes: {
    label: 'Minute',
    validation: CRON_VALIDATE_CADENCE_PRESET.minutes,
  },
  hours: {
    label: 'Hour',
    validation: CRON_VALIDATE_CADENCE_PRESET.hours,
  },
  daysOfMonth: {
    label: 'Day of Month',
    validation: CRON_VALIDATE_CADENCE_PRESET.daysOfMonth,
  },
  months: {
    label: 'Month',
    validation: CRON_VALIDATE_CADENCE_PRESET.months,
  },
  daysOfWeek: {
    label: 'Day of Week',
    validation: CRON_VALIDATE_CADENCE_PRESET.daysOfWeek,
  },
};
