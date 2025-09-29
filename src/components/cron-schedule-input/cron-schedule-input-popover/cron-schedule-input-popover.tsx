import React from 'react';

import { CRON_FIELD_CONFIGS } from '../cron-schedule-input.constants';

import { CRON_POPOVER_EXAMPLES } from './cron-schedule-input-popover.constants';
import { styled } from './cron-schedule-input-popover.styles';
import { type Props } from './cron-schedule-input-popover.types';

export default function CronScheduleInputPopover({ fieldType }: Props) {
  const config = CRON_FIELD_CONFIGS[fieldType];

  const examples = CRON_POPOVER_EXAMPLES.filter(
    (example) => example.fieldType === 'all' || example.fieldType === fieldType
  );

  return (
    <styled.PopoverContent>
      <styled.PopoverTitle>{config.label}</styled.PopoverTitle>

      <styled.ExamplesContainer>
        <styled.ExamplesList>
          {examples.map((example, index) => (
            <styled.ExampleItem key={index}>
              <styled.ExampleSymbol>
                {example.getSymbol(config)}
              </styled.ExampleSymbol>
              <styled.ExampleDescription>
                {example.description}
              </styled.ExampleDescription>
            </styled.ExampleItem>
          ))}
        </styled.ExamplesList>
      </styled.ExamplesContainer>
    </styled.PopoverContent>
  );
}
