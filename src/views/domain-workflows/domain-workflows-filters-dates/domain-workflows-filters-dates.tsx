'use client';
import * as React from 'react';

import { DatePicker } from 'baseui/datepicker';
import { FormControl } from 'baseui/form-control';
import { SIZE } from 'baseui/input';

import { type PageFilterComponentProps } from '@/components/page-filters/page-filters.types';

import { DATE_FORMAT } from './domain-workflows-filters-dates.constants';
import { overrides } from './domain-workflows-filters-dates.styles';
import { type DomainWorkflowsFiltersDatesValue } from './domain-workflows-filters-dates.types';

export default function DomainWorkflowsFiltersDates({
  value,
  setValue,
}: PageFilterComponentProps<DomainWorkflowsFiltersDatesValue>) {
  const [dates, setDates] = React.useState<Array<Date | null | undefined>>([]);

  React.useEffect(() => {
    setDates(
      Boolean(value.timeRangeStart) && Boolean(value.timeRangeEnd)
        ? [value.timeRangeStart, value.timeRangeEnd]
        : []
    );
  }, [value]);

  return (
    <FormControl label="Dates" overrides={overrides.dateFormControl}>
      <DatePicker
        value={dates}
        onChange={({ date }) => {
          if (!date || !Array.isArray(date)) {
            return;
          }
          setDates(date);
          if (date.length === 0) {
            setValue({
              timeRangeStart: undefined,
              timeRangeEnd: undefined,
            });
          } else if (date.length === 2) {
            const [start, end] = date;
            if (!start || !end) {
              return;
            }
            setValue({
              timeRangeStart: start,
              timeRangeEnd: end,
            });
          }
        }}
        onClose={() => {
          if (dates.length !== 2 || dates.some((date) => !date)) {
            setDates(
              Boolean(value.timeRangeStart) && Boolean(value.timeRangeEnd)
                ? [value.timeRangeStart, value.timeRangeEnd]
                : []
            );
          }
        }}
        placeholder="Select time range"
        formatString={DATE_FORMAT}
        size={SIZE.compact}
        quickSelect
        range
        clearable
        timeSelectStart
        timeSelectEnd
      />
    </FormControl>
  );
}
