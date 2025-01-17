'use client';
import * as React from 'react';

import { DatePicker } from 'baseui/datepicker';
import { FormControl } from 'baseui/form-control';
import { SIZE } from 'baseui/input';

import dayjs from '@/utils/datetime/dayjs';

import { DATE_FORMAT, QUICK_SELECT_OPTIONS } from './date-filter.constants';
import { overrides } from './date-filter.styles';
import { type Props } from './date-filter.types';

export default function DateFilter({
  label,
  placeholder,
  dates,
  onChangeDates,
  clearable = true,
}: Props) {
  const [internalDates, setInternalDates] = React.useState<
    Array<Date | null | undefined>
  >([]);

  const resetDates = React.useCallback(() => {
    setInternalDates(
      Boolean(dates.start) && Boolean(dates.end) ? [dates.start, dates.end] : []
    );
  }, [dates]);

  React.useEffect(() => {
    resetDates();
  }, [resetDates]);

  return (
    <FormControl label={label} overrides={overrides.dateFormControl}>
      <DatePicker
        value={internalDates}
        onChange={({ date: newDates }) => {
          if (!newDates || !Array.isArray(newDates)) {
            return;
          }
          setInternalDates(newDates);

          if (newDates.length === 0) {
            onChangeDates({
              start: undefined,
              end: undefined,
            });
          } else if (newDates.length === 2 && newDates[0] && newDates[1]) {
            const [start, end] = newDates;
            onChangeDates({
              start,
              end:
                start.getTime() === end.getTime()
                  ? dayjs(start).endOf('day').toDate()
                  : end,
            });
          }
        }}
        onClose={() => {
          if (internalDates.some((date) => !date)) {
            resetDates();
          } else if (internalDates.length === 1 && internalDates[0]) {
            onChangeDates({
              start: internalDates[0],
              end: dayjs(internalDates[0]).endOf('day').toDate(),
            });
          }
        }}
        quickSelectOptions={QUICK_SELECT_OPTIONS.map(
          ({ label, durationSeconds }) => {
            const now = new Date();
            return {
              id: label,
              beginDate: dayjs(now)
                .subtract(durationSeconds, 'seconds')
                .toDate(),
              endDate: now,
            };
          }
        )}
        placeholder={placeholder}
        formatString={DATE_FORMAT}
        size={SIZE.compact}
        quickSelect
        range
        clearable={clearable}
        timeSelectStart
        timeSelectEnd
      />
    </FormControl>
  );
}
