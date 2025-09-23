import React from 'react';

import { CRON_FIELD_CONFIGS } from '../cron-schedule-input.constants';
import type { CronFieldType } from '../cron-schedule-input.types';

import { styled } from './cron-schedule-input-popover.styles';

export type CronScheduleInputPopoverProps = {
  fieldType: CronFieldType;
};

export default function CronScheduleInputPopover({
  fieldType,
}: CronScheduleInputPopoverProps) {
  const config = CRON_FIELD_CONFIGS[fieldType];

  return (
    <styled.PopoverContent>
      <styled.PopoverTitle>{config.label}</styled.PopoverTitle>

      <styled.ExamplesContainer>
        <styled.ExamplesList>
          <styled.ExampleItem>
            <styled.ExampleSymbol>*</styled.ExampleSymbol>
            <styled.ExampleDescription>any value</styled.ExampleDescription>
          </styled.ExampleItem>
          <styled.ExampleItem>
            <styled.ExampleSymbol>,</styled.ExampleSymbol>
            <styled.ExampleDescription>
              value list separator
            </styled.ExampleDescription>
          </styled.ExampleItem>
          <styled.ExampleItem>
            <styled.ExampleSymbol>-</styled.ExampleSymbol>
            <styled.ExampleDescription>
              range of values
            </styled.ExampleDescription>
          </styled.ExampleItem>
          <styled.ExampleItem>
            <styled.ExampleSymbol>/</styled.ExampleSymbol>
            <styled.ExampleDescription>step values</styled.ExampleDescription>
          </styled.ExampleItem>
          <styled.ExampleItem>
            <styled.ExampleSymbol>
              {config.validation.minValue}-{config.validation.maxValue}
            </styled.ExampleSymbol>
            <styled.ExampleDescription>
              allowed values
            </styled.ExampleDescription>
          </styled.ExampleItem>
          {fieldType === 'months' && (
            <styled.ExampleItem>
              <styled.ExampleSymbol>JAN-DEC</styled.ExampleSymbol>
              <styled.ExampleDescription>
                alternative single values
              </styled.ExampleDescription>
            </styled.ExampleItem>
          )}
          {fieldType === 'daysOfWeek' && (
            <styled.ExampleItem>
              <styled.ExampleSymbol>SUN-SAT</styled.ExampleSymbol>
              <styled.ExampleDescription>
                alternative single values
              </styled.ExampleDescription>
            </styled.ExampleItem>
          )}
        </styled.ExamplesList>
      </styled.ExamplesContainer>
    </styled.PopoverContent>
  );
}
