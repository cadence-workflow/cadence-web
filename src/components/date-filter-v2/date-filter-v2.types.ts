import { type DATE_FILTER_RELATIVE_VALUES } from './date-filter-v2.constants';

export type RelativeDurationConfig = {
  label: string;
  durationSeconds: number;
};

export type RelativeDateFilterValue = keyof typeof DATE_FILTER_RELATIVE_VALUES;

export type DateFilterValue = Date | 'now' | RelativeDateFilterValue;

export type DateFilterRange = {
  start: DateFilterValue | undefined;
  end: DateFilterValue | undefined;
};

export type Props = {
  label: string;
  placeholder: string;
  dates: DateFilterRange;
  onChangeDates: (v: DateFilterRange) => void;
};
