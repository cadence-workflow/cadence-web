import { Input, SIZE } from 'baseui/input';
import { LabelSmall } from 'baseui/typography';

import { type FieldComponentProps } from '@/components/form/form.types';

import { overrides } from './domain-page-settings-retention-period.styles';

export default function DomainPageSettingsRetentionPeriod(
  props: FieldComponentProps<number>
) {
  return (
    <Input
      onBlur={props.onBlur}
      onChange={(e) => {
        props.onChange(parseInt(e.target.value));
      }}
      value={!isNaN(props.value) ? props.value : ''}
      error={Boolean(props.error)}
      endEnhancer={<LabelSmall>{props.value == 1 ? 'Day' : 'Days'}</LabelSmall>}
      size={SIZE.compact}
      type="number"
      min={1}
      pattern="^d*$"
      overrides={overrides.input}
    />
  );
}
