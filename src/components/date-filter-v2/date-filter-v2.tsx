import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from 'baseui/button';
import { StatefulCalendar } from 'baseui/datepicker';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { StatefulMenu } from 'baseui/menu';
import { Popover } from 'baseui/popover';

import dayjs from '@/utils/datetime/dayjs';

import { DATE_FILTER_RELATIVE_VALUES } from './date-filter-v2.constants';
import {
  type DateValue,
  type DateRangeV2,
  type Props,
} from './date-filter-v2.types';
import isRelativeDateValue from './helpers/is-relative-date-value';
import { overrides } from './date-filter-v2.styles';

export default function DateFilterV2({
  label,
  placeholder,
  dates,
  onChangeDates,
}: Props) {
  /**
   * <Popover content={Calendars with quick select}>
   *    <Input>
   * </Popover>
   */
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [isCustomRangeEnabled, setIsCustomRangeEnabled] =
    useState<boolean>(false);

  const [internalStart, setInternalStart] = useState<DateValue | undefined>(
    undefined
  );
  useEffect(() => {
    setInternalStart(Boolean(dates.start) ? dates.start : undefined);
  }, [dates.start]);

  const [internalEnd, setInternalEnd] = useState<DateValue | undefined>(
    undefined
  );
  useEffect(() => {
    setInternalEnd(Boolean(dates.end) ? dates.end : undefined);
  }, [dates.end]);

  const displayValue = useMemo<string>(() => {
    if (!dates.end || !dates.start) return 'Unknown';
    if (dates.end === 'now' && isRelativeDateValue(dates.start))
      return DATE_FILTER_RELATIVE_VALUES[dates.start].label;
    return `${dates.start} - ${dates.end}`;
  }, [dates]);

  const onChangeDatesAndClose = useCallback(
    (range: DateRangeV2) => {
      onChangeDates(range);
      setIsPopoverOpen(false);
    },
    [onChangeDates]
  );

  useEffect(() => {
    if (
      dates.end instanceof dayjs.Dayjs &&
      dates.start instanceof dayjs.Dayjs
    ) {
      setIsCustomRangeEnabled(true);
    }
  }, [dates]);

  return (
    <FormControl label={label} overrides={overrides.dateFormControl}>
      <Popover
        isOpen={isPopoverOpen}
        content={
          <div>
            <div data-testid="quick select options">
              <div>Quick Range</div>
              <StatefulMenu
                items={[
                  ...Object.entries(DATE_FILTER_RELATIVE_VALUES).map(
                    ([key, { label }]) => ({
                      key,
                      label,
                    })
                  ),
                  { key: 'custom', label: 'Custom Range' },
                ]}
                onItemSelect={({
                  item,
                }: {
                  item: { key: string; label: string };
                }) => {
                  if (item.key === 'custom') {
                    setIsCustomRangeEnabled(true);
                  } else if (isRelativeDateValue(item.key)) {
                    onChangeDatesAndClose({
                      start: item.key,
                      end: 'now',
                    });
                  }
                }}
              />
              <Button
                disabled={!internalStart || !internalEnd}
                onClick={() => {
                  if (!internalStart || !internalEnd) return;
                  onChangeDatesAndClose({
                    start: internalStart,
                    end: internalEnd,
                  });
                }}
              >
                Save dates
              </Button>
            </div>
            <div data-testid="date selectors">
              <div data-testid="one date selector">
                <StatefulCalendar
                  onChange={({ date }) => {
                    if (date instanceof Date) {
                      setInternalStart(dayjs(date));
                    }
                  }}
                  timeSelectStart
                />
              </div>
              <div data-testid="the other date selector">
                <StatefulCalendar
                  onChange={({ date }) => {
                    if (date instanceof Date) {
                      setInternalEnd(dayjs(date));
                    }
                  }}
                  timeSelectEnd
                />
              </div>
            </div>
          </div>
        }
      >
        <Input
          readOnly
          placeholder={placeholder}
          value={displayValue}
          onFocus={() => setIsPopoverOpen(true)}
        />
      </Popover>
    </FormControl>
  );
}
