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
import isRelativeDateValue from './helpers/is-relative-date-filter-value';
import stringifyDateValue from './helpers/stringify-date-value';

export default function DateFilterV2({
  label,
  placeholder,
  dates,
  onChangeDates,
}: Props) {
  const [tempDates, setTempDates] = useState<{
    start: dayjs.Dayjs | undefined;
    end: dayjs.Dayjs | undefined;
  }>({
    start: undefined,
    end: undefined,
  });
  const areTempDatesInvalid = useMemo(
    () => Boolean(tempDates.end?.isBefore(tempDates.start)),
    [tempDates]
  );

  useEffect(() => {
    if (dayjs.isDayjs(dates.start) && dayjs.isDayjs(dates.end))
      setTempDates({
        start: dates.start,
        end: dates.end,
      });
  }, [dates]);

  const [canSaveDate, setCanSaveDate] = useState<boolean>(false);

  const saveDates = useCallback(
    (dates: DateFilterRange) => {
      onChangeDates(dates);
      setCanSaveDate(false);
    },
    [onChangeDates]
  );

  const displayValue = useMemo<string>(() => {
    if (!dates.end || !dates.start) return 'Unknown';
    if (dates.end === 'now' && isRelativeDateValue(dates.start))
      return DATE_FILTER_RELATIVE_VALUES[dates.start].label;

    return `${stringifyDateValue(dates.start, 'pretty')} - ${stringifyDateValue(dates.end, 'pretty')}`;
  }, [dates]);

  return (
    <FormControl label={label} overrides={overrides.dateFormControl}>
      <StatefulPopover
        overrides={overrides.popover}
        triggerType="click"
        dismissOnClickOutside={!canSaveDate}
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
                  disabled={!canSaveDate || areTempDatesInvalid}
                  onClick={() => {
                    if (!canSaveDate || areTempDatesInvalid) return;
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
                onChange={({ date: newDates }) => {
                  if (!newDates || !Array.isArray(newDates)) {
                    return;
                  }

                  if (newDates.length === 2 && newDates[0] && newDates[1]) {
                    setTempDates({
                      start: dayjs(newDates[0]),
                      end:
                        newDates[0].getTime() === newDates[1].getTime()
                          ? dayjs(newDates[1]).endOf('day')
                          : dayjs(newDates[1]),
                    });
                    setCanSaveDate(true);
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
                      disabled={!canSaveDate}
                      value={tempDates.start?.toDate()}
                      maxTime={tempDates.end?.toDate()}
                      error={areTempDatesInvalid}
                      onChange={(newStart) =>
                        setTempDates((oldDates) => ({
                          ...oldDates,
                          start: dayjs(newStart),
                        }))
                      }
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
                      disabled={!canSaveDate}
                      value={tempDates.end?.toDate()}
                      minTime={tempDates.start?.toDate()}
                      error={areTempDatesInvalid}
                      onChange={(newEnd) =>
                        setTempDates((oldDates) => ({
                          ...oldDates,
                          end: dayjs(newEnd),
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
                  setCanSaveDate(false);
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
