import { type AttributeValueType } from './workflow-actions-search-attributes.types';

export const BOOLEAN_OPTIONS = [
  { id: 'true', label: 'TRUE' },
  { id: 'false', label: 'FALSE' },
] as const;

export const INPUT_PLACEHOLDERS_FOR_VALUE_TYPE: Record<
  AttributeValueType,
  string
> = {
  INDEXED_VALUE_TYPE_DATETIME: 'Select date and time',
  INDEXED_VALUE_TYPE_BOOL: 'Select value',
  INDEXED_VALUE_TYPE_INT: 'Enter integer',
  INDEXED_VALUE_TYPE_DOUBLE: 'Enter number',
  INDEXED_VALUE_TYPE_STRING: 'Enter value',
  INDEXED_VALUE_TYPE_KEYWORD: 'Enter value',
  INDEXED_VALUE_TYPE_INVALID: 'Enter value',
};

export const DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';
