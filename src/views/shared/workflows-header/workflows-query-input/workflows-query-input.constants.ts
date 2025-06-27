//autocompletes suggestions

export const TIME_ATTRIBUTES = [
  'CloseTime',
  'StartTime',
  'UpdateTime',
  'HistoryLength',
];

export const OTHER_ATTRIBUTES = ['CloseStatus', 'IsCron', 'Passed'];

export const COMPARISON_OPERATORS = ['=', '!=', '>', '>=', '<', '<='];

export const OPERATORS = [...COMPARISON_OPERATORS, 'BETWEEN ... AND...'];

export const ID_ATTRIBUTES = [
  'WorkflowType',
  'WorkflowID',
  'DomainID',
  'RolloutID',
  'RunID',
  'TaskList',
];

export const ATTRIBUTES = [
  ...TIME_ATTRIBUTES,
  ...OTHER_ATTRIBUTES,
  ...ID_ATTRIBUTES,
];

export const LOGICAL_OPERATORS = ['AND', 'OR', 'IN'];

export const STATUSES = [
  '"completed"',
  '"failed"',
  '"canceled"',
  '"terminated"',
  '"continued_as_new"',
  '"timed_out"',
];

export const VALUES = ['TRUE', 'FALSE'];

export const TIME_FORMAT = '"YYYY-MM-DDTHH:MM:SS±HH:MM"';

export const TIME_FORMAT_BETWEEN =
  '"YYYY-MM-DDTHH:MM:SS±HH:MM" AND "YYYY-MM-DDTHH:MM:SS±HH:MM"';

export const EQUALITY_OPERATORS = ['=', '!='];

export const OPERATORS_TO_PRESERVE = [
  ...COMPARISON_OPERATORS,
  'BETWEEN',
  'AND',
];
