import { type Dayjs } from 'dayjs';

import { type DATE_FILTER_RELATIVE_VALUES } from './date-filter-v2.constants';

export type RelativeDurationConfig = {
  label: string;
  durationSeconds: number;
};

export type RelativeDateValue = keyof typeof DATE_FILTER_RELATIVE_VALUES;

export type DateValue = Dayjs | 'now' | RelativeDateValue;

export type DateRangeV2 = {
  start: DateValue | undefined;
  end: DateValue | undefined;
};

export type Props = {
  label: string;
  placeholder: string;
  dates: DateRangeV2;
  onChangeDates: (v: DateRangeV2) => void;
};
