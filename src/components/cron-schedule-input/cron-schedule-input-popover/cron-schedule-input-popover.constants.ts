import { type CronInputPopoverExample } from './cron-schedule-input-popover.types';

export const CRON_POPOVER_EXAMPLES: CronInputPopoverExample[] = [
  {
    getSymbol: () => '*',
    description: 'any value',
    fieldType: 'all',
  },
  {
    getSymbol: () => ',',
    description: 'value list separator',
    fieldType: 'all',
  },
  {
    getSymbol: () => '-',
    description: 'range of values',
    fieldType: 'all',
  },
  {
    getSymbol: () => '/',
    description: 'step values',
    fieldType: 'all',
  },
  {
    getSymbol: (config) =>
      `${config.validation.minValue}-${config.validation.maxValue}`,
    description: 'allowed values',
    fieldType: 'all',
  },
  {
    getSymbol: () => 'JAN-DEC',
    description: 'alternative single values',
    fieldType: 'months',
  },
  {
    getSymbol: () => 'SUN-SAT',
    description: 'alternative single values',
    fieldType: 'daysOfWeek',
  },
];
