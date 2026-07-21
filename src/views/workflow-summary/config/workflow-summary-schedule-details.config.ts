import { createElement } from 'react';

import Link from '@/components/link/link';

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
        return typeof scheduleTime === 'string' ? scheduleTime : '-';
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
      getValue: ({ cluster, domain, searchAttributes }) => {
        const backfillId = searchAttributes?.CadenceScheduleBackfillID;
        if (typeof backfillId !== 'string') {
          return null;
        }

        return createElement(
          Link,
          {
            href: `/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows?input=query&query=${encodeURIComponent(`CadenceScheduleBackfillID="${backfillId}"`)}`,
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
