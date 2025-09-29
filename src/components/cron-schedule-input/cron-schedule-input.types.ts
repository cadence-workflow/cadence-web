import type React from 'react';

import type { CronData as CronScheduleValue } from 'cron-validate';

export type { CronFieldType } from 'cron-validate';
export type { CronScheduleValue };

export type CronScheduleInputProps = {
  value?: Partial<CronScheduleValue>;
  onChange?: (value: Partial<CronScheduleValue>) => void;
  onBlur?: (e: React.FocusEvent) => void;
  error?: string | Record<keyof CronScheduleValue, string>;
  disabled?: boolean;
  onFocus?: (e: React.FocusEvent) => void;
};

export type CronFieldConfig = {
  label: string;
  validation: {
    minValue: number;
    maxValue: number;
  };
};
