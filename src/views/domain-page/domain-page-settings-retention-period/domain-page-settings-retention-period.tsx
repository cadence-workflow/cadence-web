import { Input, SIZE } from 'baseui/input';
import { LabelSmall } from 'baseui/typography';

import { type FieldComponentProps } from '@/views/shared/settings-form/settings-form.types';

import { NUM_SECONDS_IN_DAY } from './domain-page-settings-retention-period.constants';
import { overrides } from './domain-page-settings-retention-period.styles';

export default function DomainPageSettingsRetentionPeriod(
  props: FieldComponentProps<number>
) {
  // Retention period is handled in days in Cadence, but Protobuf uses seconds and nanoseconds.
  // We expect values be divisible by days; otherwise, we round to two decimal places for display.
  const valueInDays =
    Math.round((props.value / NUM_SECONDS_IN_DAY) * 100) / 100;

  return (
    <Input
      onBlur={props.onBlur}
      onChange={(e) => {
        props.onChange(parseInt(e.target.value) * NUM_SECONDS_IN_DAY);
      }}
      value={!isNaN(props.value) ? valueInDays : ''}
      error={Boolean(props.error)}
      endEnhancer={
        <LabelSmall>{valueInDays === 1 ? 'Day' : 'Days'}</LabelSmall>
      }
      size={SIZE.compact}
      type="number"
      min={1}
      pattern="^d*$"
      overrides={overrides.input}
    />
  );
}
