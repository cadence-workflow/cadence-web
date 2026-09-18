import { createElement } from 'react';

import Link from '@/components/link/link';
import formatDate from '@/utils/data-formatters/format-date';
import escapeVisibilityQueryValue from '@/utils/visibility/escape-visibility-query-value';

import { type WorkflowSummaryScheduleDetailsConfig } from '../workflow-summary-schedule-details/workflow-summary-schedule-details.types';

const workflowSummaryScheduleDetailsConfig: WorkflowSummaryScheduleDetailsConfig[] =
  [
    {
      key: 'scheduleId',
      getLabel: () => 'Schedule ID',
      getValue: ({ cluster, domain, scheduleId }) =>
        createElement(
          Link,
          {
            href: `/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/schedules/${encodeURIComponent(scheduleId)}/details`,
          },
          scheduleId
        ),
    },
    {
      key: 'scheduleTime',
      getLabel: () => 'Schedule time',
      getValue: ({ searchAttributes }) => {
        const scheduleTime = searchAttributes?.CadenceScheduleTime;
        if (typeof scheduleTime !== 'string') {
          return '-';
        }

        const timestampMs = Date.parse(scheduleTime);
        if (Number.isNaN(timestampMs)) {
          return '-';
        }

        return createElement(
          'div',
          { suppressHydrationWarning: true },
          formatDate(timestampMs)
        );
      },
    },
    {
      key: 'backfill',
      getLabel: () => 'Backfill',
      getValue: ({ searchAttributes }) =>
        searchAttributes?.CadenceScheduleIsBackfill === true ? 'Yes' : 'No',
    },
    {
      key: 'backfillId',
      getLabel: () => 'Backfill ID',
      getValue: ({ cluster, domain, scheduleId, searchAttributes }) => {
        const backfillId = searchAttributes?.CadenceScheduleBackfillID;
        if (typeof backfillId !== 'string') {
          return null;
        }

        const query = `CadenceScheduleID = "${escapeVisibilityQueryValue(scheduleId)}" AND CadenceScheduleBackfillID = "${escapeVisibilityQueryValue(backfillId)}"`;

        return createElement(
          Link,
          {
            href: `/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows?input=query&query=${encodeURIComponent(query)}`,
          },
          backfillId
        );
      },
      hide: ({ searchAttributes }) =>
        searchAttributes?.CadenceScheduleIsBackfill !== true ||
        typeof searchAttributes?.CadenceScheduleBackfillID !== 'string',
    },
  ];

export default workflowSummaryScheduleDetailsConfig;
