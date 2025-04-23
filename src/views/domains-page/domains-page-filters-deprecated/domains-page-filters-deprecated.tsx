import { Checkbox, STYLE_TYPE, LABEL_PLACEMENT } from 'baseui/checkbox';

import { type PageFilterComponentProps } from '@/components/page-filters/page-filters.types';

import { overrides } from './domains-page-filters-deprecated.styles';
import { type DomainsPageFiltersDeprecatedValue } from './domains-page-filters-deprecated.types';

export default function DomainsPageFilterDeprecated({
  value,
  setValue,
}: PageFilterComponentProps<DomainsPageFiltersDeprecatedValue>) {
  return (
    <Checkbox
      checkmarkType={STYLE_TYPE.toggle}
      labelPlacement={LABEL_PLACEMENT.right}
      overrides={overrides.checkbox}
      checked={value.showDeprecated}
      onChange={(e) =>
        setValue({ showDeprecated: e.target.checked || undefined })
      }
    >
      Show deprecated domains
    </Checkbox>
  );
}
