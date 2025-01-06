'use client';
import * as React from 'react';

import { DatePicker as DatePickerBaseweb } from 'baseui/datepicker';
import { FormControl } from 'baseui/form-control';
import { SIZE } from 'baseui/input';

import { DATE_FORMAT } from './date-picker.constants';
import { overrides } from './date-picker.styles';
import { type Props } from './date-picker.types';

export default function DatePicker({
  label,
  placeholder,
  dates,
  setDates,
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
      <DatePickerBaseweb
        value={internalDates}
        onChange={({ date: newDates }) => {
          if (!newDates || !Array.isArray(newDates)) {
            return;
          }
          setInternalDates(newDates);
          if (newDates.length === 0) {
            setDates({
              start: undefined,
              end: undefined,
            });
          } else if (newDates.length === 2) {
            const [start, end] = newDates;
            if (!start || !end) {
              return;
            }
            setDates({ start, end });
          }
        }}
        onClose={() => {
          if (
            internalDates.length !== 2 ||
            internalDates.some((date) => !date)
          ) {
            resetDates();
          }
        }}
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
