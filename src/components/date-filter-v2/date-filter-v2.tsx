import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from 'baseui/button';
import { StatefulCalendar, TimePicker } from 'baseui/datepicker';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { StatefulPopover } from 'baseui/popover';
import { MdClose } from 'react-icons/md';

import dayjs from '@/utils/datetime/dayjs';

import { DATE_FILTER_RELATIVE_VALUES } from './date-filter-v2.constants';
import { overrides, styled } from './date-filter-v2.styles';
import {
  type Props,
  type DateFilterRange,
  type RelativeDateFilterValue,
} from './date-filter-v2.types';
import isRelativeDateFilterValue from './helpers/is-relative-date-filter-value';
import stringifyDateFilterValue from './helpers/stringify-date-filter-value';

export default function DateFilterV2({
  label,
  placeholder,
  dates,
  onChangeDates,
}: Props) {
  const [tempDates, setTempDates] = useState<{
    start: Date | undefined;
    end: Date | undefined;
  }>({
    start: undefined,
    end: undefined,
  });

  const resetTempDates = useCallback(() => {
    setTempDates(
      dates.start instanceof Date && dates.end instanceof Date
        ? {
            start: dates.start,
            end: dates.end,
          }
        : { start: undefined, end: undefined }
    );
  }, [dates]);

  useEffect(() => {
    resetTempDates();
  }, [resetTempDates]);

  const areTempDatesModified = useMemo(() => {
    if (!tempDates.start || !tempDates.end) return false;

    const originalStartTime =
      dates.start instanceof Date ? dates.start.getTime() : undefined;

    const originalEndTime =
      dates.end instanceof Date ? dates.end.getTime() : undefined;

    return (
      originalStartTime !== tempDates.start.getTime() ||
      originalEndTime !== tempDates.end.getTime()
    );
  }, [dates, tempDates.start, tempDates.end]);

  const areTempDatesInvalid = useMemo(
    () =>
      Boolean(
        tempDates.end &&
          tempDates.start &&
          dayjs(tempDates.end).isBefore(tempDates.start)
      ),
    [tempDates]
  );

  const saveDates = useCallback(
    (dates: DateFilterRange) => {
      onChangeDates(dates);
      resetTempDates();
    },
    [onChangeDates, resetTempDates]
  );

  const displayValue = useMemo<string>(() => {
    if (!dates.end || !dates.start) return 'Unknown';
    if (dates.end === 'now' && isRelativeDateFilterValue(dates.start))
      return DATE_FILTER_RELATIVE_VALUES[dates.start].label;

    return `${stringifyDateFilterValue(dates.start, 'pretty')} - ${stringifyDateFilterValue(dates.end, 'pretty')}`;
  }, [dates]);

  return (
    <FormControl label={label} overrides={overrides.dateFormControl}>
      <StatefulPopover
        overrides={overrides.popover}
        triggerType="click"
        dismissOnClickOutside={!areTempDatesModified}
        content={({ close }) => (
          <styled.PopoverContentContainer>
            <styled.ContentColumn>
              <styled.ContentHeader>Quick Range</styled.ContentHeader>
              <styled.MenuContainer>
                <styled.MenuItemsContainer>
                  {Object.entries(DATE_FILTER_RELATIVE_VALUES).map(
                    ([key, { label }]) => (
                      <Button
                        size="compact"
                        key={key}
                        kind={
                          dates.end === 'now' && dates.start === key
                            ? 'secondary'
                            : 'tertiary'
                        }
                        overrides={overrides.menuItemButton}
                        onClick={() => {
                          saveDates({
                            start: key as RelativeDateFilterValue,
                            end: 'now',
                          });
                          close();
                        }}
                      >
                        {label}
                      </Button>
                    )
                  )}
                </styled.MenuItemsContainer>
                <Button
                  size="mini"
                  disabled={!areTempDatesModified || areTempDatesInvalid}
                  onClick={() => {
                    if (!areTempDatesModified || areTempDatesInvalid) return;
                    saveDates(tempDates);
                    close();
                  }}
                >
                  Save
                </Button>
              </styled.MenuContainer>
            </styled.ContentColumn>
            <styled.ContentColumn>
              <styled.ContentHeader>Custom Range</styled.ContentHeader>
              <StatefulCalendar
                density="high"
                overrides={overrides.calendar}
                initialState={
                  tempDates.start && tempDates.end
                    ? { value: [tempDates.start, tempDates.end] }
                    : undefined
                }
                onChange={({ date: newDates }) => {
                  if (!newDates || !Array.isArray(newDates)) {
                    return;
                  }

                  if (newDates.length === 2 && newDates[0] && newDates[1]) {
                    setTempDates({
                      start: newDates[0],
                      end:
                        newDates[0].getTime() === newDates[1].getTime()
                          ? dayjs(newDates[1]).endOf('day').toDate()
                          : newDates[1],
                    });
                  }
                }}
                range
              />
              <styled.TimeInputsContainer>
                <styled.TimeInputContainer>
                  <FormControl
                    label="Start time"
                    overrides={overrides.timeFormControl}
                  >
                    <TimePicker
                      size="compact"
                      creatable
                      nullable
                      disabled={!tempDates.start || !tempDates.end}
                      value={tempDates.start}
                      maxTime={tempDates.end}
                      error={areTempDatesInvalid}
                      onChange={(newStart) => {
                        setTempDates((oldDates) => ({
                          ...oldDates,
                          start: newStart || undefined,
                        }));
                      }}
                    />
                  </FormControl>
                </styled.TimeInputContainer>
                <styled.TimeInputContainer>
                  <FormControl
                    label="End time"
                    overrides={overrides.timeFormControl}
                  >
                    <TimePicker
                      size="compact"
                      creatable
                      nullable
                      disabled={!tempDates.start || !tempDates.end}
                      value={tempDates.end}
                      minTime={tempDates.start}
                      error={areTempDatesInvalid}
                      onChange={(newEnd) =>
                        setTempDates((oldDates) => ({
                          ...oldDates,
                          end: newEnd || undefined,
                        }))
                      }
                    />
                  </FormControl>
                </styled.TimeInputContainer>
              </styled.TimeInputsContainer>
            </styled.ContentColumn>
            <styled.CloseButtonContainer>
              <Button
                size="compact"
                kind="tertiary"
                shape="circle"
                data-testid="close-button"
                onClick={() => {
                  resetTempDates();
                  close();
                }}
              >
                <MdClose />
              </Button>
            </styled.CloseButtonContainer>
          </styled.PopoverContentContainer>
        )}
      >
        <div>
          <Input
            readOnly
            size="compact"
            placeholder={placeholder}
            value={displayValue}
          />
        </div>
      </StatefulPopover>
    </FormControl>
  );
}
