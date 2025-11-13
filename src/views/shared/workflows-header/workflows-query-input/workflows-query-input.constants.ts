export const TIME_ATTRIBUTES = [
  'CloseTime',
  'StartTime',
  'UpdateTime',
  'HistoryLength',
];

export const ID_ATTRIBUTES = [
  'WorkflowType',
  'WorkflowID',
  'DomainID',
  'RolloutID',
  'RunID',
  'TaskList',
];

export const CLOSE_STATUS_ATTRIBUTE = 'CloseStatus';

export const BOOLEAN_ATTRIBUTES = ['IsCron', 'Passed'];

export const ATTRIBUTES = [
  ...TIME_ATTRIBUTES,
  ...ID_ATTRIBUTES,
  CLOSE_STATUS_ATTRIBUTE,
  ...BOOLEAN_ATTRIBUTES,
];

export const LOGICAL_OPERATORS = ['AND', 'OR'];

export const EQUALITY_OPERATORS = ['=', '!='];

export const COMPARISON_OPERATORS = [
  ...EQUALITY_OPERATORS,
  '>',
  '>=',
  '<',
  '<=',
  // TODO @adhitya.mamallan: add LIKE here when it is supported
];

export const STATUSES = [
  '"completed"',
  '"failed"',
  '"canceled"',
  '"terminated"',
  '"continued_as_new"',
  '"timed_out"',
];

export const BOOLEAN_VALUES = ['"true"', '"false"'];

export const TIME_FORMAT = '"YYYY-MM-DDTHH:MM:SS±HH:MM"';

export const TIME_FORMAT_BETWEEN =
  '"YYYY-MM-DDTHH:MM:SS±HH:MM" AND "YYYY-MM-DDTHH:MM:SS±HH:MM"';

export const OPERATORS_TO_PRESERVE = [
  ...COMPARISON_OPERATORS,
  'BETWEEN',
  'AND',
];
