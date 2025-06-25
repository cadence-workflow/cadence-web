//autocompletes suggestions

export const TIME_ATTRIBUTES = [
  'CloseTime',
  'StartTime',
  'UpdateTime',
  'HistoryLength',
];

export const ATTRIBUTES = [
  'CloseTime',
  'StartTime',
  'UpdateTime',
  'HistoryLength',
  'CloseStatus',
  'IsCron',
  'Passed',
  'WorkflowType',
  'WorkflowID',
  'DomainID',
  'RolloutID',
  'RunID',
  'TaskList',
];

export const OPERATORS = [
  '=',
  '!=',
  '>',
  '>=',
  '<',
  '<=',
  'BETWEEN ... AND...',
];

export const COMPARISON_OPERATORS = ['=', '!=', '>', '>=', '<', '<='];

export const ID_ATTRIBUTES = [
  'WorkflowType',
  'WorkflowID',
  'DomainID',
  'RolloutID',
  'RunID',
  'TaskList',
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
  '=',
  '!=',
  '>',
  '>=',
  '<',
  '<=',
  'BETWEEN',
  'AND',
];
