import { createElement } from 'react';

import queryString from 'query-string';

import Link from '@/components/link/link';

import WorkflowDiagnosticsMetadataJson from '../workflow-diagnostics-metadata-json/workflow-diagnostics-metadata-json';
import WorkflowDiagnosticsMetadataPlaceholderText from '../workflow-diagnostics-metadata-placeholder-text/workflow-diagnostics-metadata-placeholder-text';
import { type WorkflowDiagnosticsMetadataParser } from '../workflow-diagnostics-metadata-table/workflow-diagnostics-metadata-table.types';

const workflowDiagnosticsMetadataParsersConfig: Array<WorkflowDiagnosticsMetadataParser> =
  [
    {
      name: 'Links to workflow history for event IDs',
      matcher: (key, value) =>
        ['ActivityScheduledID', 'ActivityStartedID', 'EventID'].includes(key) &&
        value !== 0,
      renderValue: ({ domain, cluster, workflowId, runId, value }) =>
        createElement(
          Link,
          {
            href: queryString.stringifyUrl({
              url: `/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows/${encodeURIComponent(workflowId)}/${encodeURIComponent(runId)}/history`,
              query: {
                he: value,
              },
            }),
          },
          String(value)
        ),
    },
    {
      name: 'Any object as JSON',
      matcher: (_, value) => value !== null && typeof value === 'object',
      renderValue: WorkflowDiagnosticsMetadataJson,
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
        createElement(WorkflowDiagnosticsMetadataPlaceholderText, {
          placeholderText: 'Empty',
        }),
    },
  ] as const;

export default workflowDiagnosticsMetadataParsersConfig;
