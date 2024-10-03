import { createElement } from 'react';

import PrettyJson from '@/components/pretty-json/pretty-json';
import formatDate from '@/utils/data-formatters/format-date';

import { type WorkflowHistoryEventDetailsConfig } from '../workflow-history-event-details/workflow-history-event-details.types';
import WorkflowHistoryEventDetailsTaskListLink from '../workflow-history-event-details-task-list-link/workflow-history-event-details-task-list-link';

const workflowHistoryEventDetailsConfig = [
  {
    name: 'Filter empty value',
    customMatcher: ({ value }) => value === null || value === undefined,
    hide: () => true,
  },
  {
    name: 'Date object as time string',
    customMatcher: ({ value }) => value instanceof Date,
    valueComponent: ({ entryValue }) => formatDate(entryValue),
  },
  {
    name: 'Tasklists as links',
    key: 'taskList',
    valueComponent: WorkflowHistoryEventDetailsTaskListLink,
  },
  {
    name: 'Json as PrettyJson',
    pathRegex: '.*(input|result|details|Error)$',
    valueComponent: ({ entryValue }) => {
      return createElement(PrettyJson, {
        json: entryValue,
      });
    },
  },
  {
    name: 'Duration timeout & backoff seconds',
    pathRegex: '.+(TimeoutSeconds|BackoffSeconds)$',
    valueComponent: ({ entryValue }) => `${entryValue}s`, // TODO @assem.hafez: format the value as duration
  },
] as const satisfies WorkflowHistoryEventDetailsConfig[];

export default workflowHistoryEventDetailsConfig;
