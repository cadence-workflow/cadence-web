import { createElement } from 'react';

import WorkflowHistoryEventDiagnosticsJson from '../workflow-history-event-diagnostics-json/workflow-history-event-diagnostics-json';
import WorkflowHistoryEventDiagnosticsPlaceholderText from '../workflow-history-event-diagnostics-placeholder-text/workflow-history-event-diagnostics-placeholder-text';
import { type WorkflowHistoryEventDiagnosticsParser } from '../workflow-history-event-diagnostics-table/workflow-history-event-diagnostics-table.types';

const workflowHistoryDiagnosticsParsersConfig: Array<WorkflowHistoryEventDiagnosticsParser> =
  [
    {
      name: 'Any object as JSON',
      matcher: (_, value) => value !== null && typeof value === 'object',
      renderValue: WorkflowHistoryEventDiagnosticsJson,
      forceWrap: true,
    },
    {
      name: 'Hidden null/undefined values',
      matcher: (_, value) => value === null || value === undefined,
      hide: true,
    },
    {
      name: 'Placeholder for empty string values',
      matcher: (_, value) => value === '',
      renderValue: () =>
        createElement(WorkflowHistoryEventDiagnosticsPlaceholderText, {
          placeholderText: 'Empty',
        }),
    },
  ] as const;

export default workflowHistoryDiagnosticsParsersConfig;
