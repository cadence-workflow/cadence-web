'use client';
import * as React from 'react';
import { DatePicker } from 'baseui/datepicker';
import { FormControl } from 'baseui/form-control';
import { SIZE } from 'baseui/input';

import { type PageFilterComponentProps } from '@/components/page-filters/page-filters.types';
import { DATE_FORMAT } from './domain-page-workflows-filters-dates.constants';
import { overrides } from './domain-page-workflows-filters-dates.styles';
import domainPageQueryParamsConfig from '../config/domain-page-query-params.config';

export default function DomainPageWorkflowsFiltersDates({
  queryParams,
  setQueryParams,
}: PageFilterComponentProps<typeof domainPageQueryParamsConfig>) {
  const [dates, setDates] = React.useState<Array<Date | null | undefined>>([]);

  React.useEffect(() => {
    setDates(
      Boolean(queryParams.startDate) && Boolean(queryParams.endDate)
        ? [queryParams.startDate, queryParams.endDate]
        : []
    );
  }, [queryParams]);

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
            setQueryParams({
              startDate: undefined,
              endDate: undefined,
            });
          } else if (date.length === 2) {
            const [start, end] = date;
            if (!start || !end) {
              return;
            }
            setQueryParams({
              startDate: start.toISOString(),
              endDate: end.toISOString(),
            });
          }
        }}
        onClose={() => {
          if (dates.length !== 2 || dates.some((date) => !date)) {
            setDates(
              Boolean(queryParams.startDate) && Boolean(queryParams.endDate)
                ? [queryParams.startDate, queryParams.endDate]
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
