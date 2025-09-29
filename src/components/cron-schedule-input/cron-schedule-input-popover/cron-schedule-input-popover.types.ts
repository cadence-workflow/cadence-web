import {
  type CronFieldConfig,
  type CronScheduleValue,
} from '../cron-schedule-input.types';

export type Props = {
  fieldType: keyof CronScheduleValue;
};

export type CronInputPopoverExample = {
  getSymbol: (config: CronFieldConfig) => string;
  description: string;
  fieldType: CronInputPopoverExampleKey | 'all';
};

export type CronInputPopoverExampleKey = keyof CronScheduleValue;
