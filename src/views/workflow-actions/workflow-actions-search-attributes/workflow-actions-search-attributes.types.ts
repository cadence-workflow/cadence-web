import { type IndexedValueType } from '@/__generated__/proto-ts/uber/cadence/api/v1/IndexedValueType';

export { type IndexedValueType as AttributeValueType };

export type SearchAttributeOption = {
  name: string;
  valueType: IndexedValueType;
};

export type SearchAttributeItem = {
  key: string;
  value: string | number | boolean;
};

export type Props = {
  isLoading?: boolean;
  value?: Array<SearchAttributeItem>;
  onChange: (value: Array<SearchAttributeItem>) => void;
  error?: string | Array<Partial<Record<'key' | 'value', string>> | undefined>;
  searchAttributes: Array<SearchAttributeOption>;
  addButtonText?: string;
};
