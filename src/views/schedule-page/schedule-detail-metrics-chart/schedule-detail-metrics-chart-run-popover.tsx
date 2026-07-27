import React from 'react';

import { MdOpenInNew } from 'react-icons/md';

import Link from '@/components/link/link';
import formatDate from '@/utils/data-formatters/format-date';
import WorkflowEventDetailsExecutionLink from '@/views/shared/workflow-event-details-execution-link/workflow-event-details-execution-link';
import { WORKFLOW_STATUS_NAMES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';

import { getScheduleMetricsChartStatus } from './helpers/get-schedule-metrics-chart-status';
import {
  RUN_POPOVER_BACKFILL_LABEL,
  RUN_POPOVER_TEST_IDS,
  RUN_POPOVER_TIMESTAMP_LABELS,
} from './schedule-detail-metrics-chart-run-popover.constants';
import { styled } from './schedule-detail-metrics-chart-run-popover.styles';
import { type Props } from './schedule-detail-metrics-chart-run-popover.types';
import ScheduleDetailMetricsChartStatusIcon from './schedule-detail-metrics-chart-status-icon';

function formatTimestamp(timestampMs: number | null) {
  if (timestampMs == null) {
    return '-';
  }

  return formatDate(timestampMs);
}

export default function ScheduleDetailMetricsChartRunPopover({
  runs,
  domain,
  cluster,
}: Props) {
  return (
    <styled.Content
      data-testid={RUN_POPOVER_TEST_IDS.content}
      onPointerDown={(event: React.PointerEvent<HTMLDivElement>) =>
        event.stopPropagation()
      }
    >
      {runs.map((run) => (
        <styled.RunEntry
          key={run.runId}
          data-testid={RUN_POPOVER_TEST_IDS.runEntry}
        >
          <styled.RunId>
            <WorkflowEventDetailsExecutionLink
              runId={run.runId}
              workflowId={run.workflowId}
              domain={domain}
              cluster={cluster}
            />
          </styled.RunId>
          <styled.DetailRow>
            <styled.DetailLabel>Status</styled.DetailLabel>
            <styled.DetailValue>
              <styled.Status>
                <span data-testid={RUN_POPOVER_TEST_IDS.statusIcon}>
                  <ScheduleDetailMetricsChartStatusIcon
                    variant={getScheduleMetricsChartStatus(run)}
                    size={14}
                  />
                </span>
                <span>{WORKFLOW_STATUS_NAMES[run.status]}</span>
              </styled.Status>
            </styled.DetailValue>
          </styled.DetailRow>
          {run.backfillId != null && (
            <styled.DetailRow>
              <styled.DetailLabel>
                {RUN_POPOVER_BACKFILL_LABEL}
              </styled.DetailLabel>
              <styled.DetailValue>
                <Link
                  href={`/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows?input=query&query=${encodeURIComponent(`CadenceScheduleBackfillID="${run.backfillId}"`)}`}
                >
                  <styled.LinkContent>
                    {run.backfillId}
                    <MdOpenInNew aria-hidden size={14} />
                  </styled.LinkContent>
                </Link>
              </styled.DetailValue>
            </styled.DetailRow>
          )}
          <styled.DetailRow>
            <styled.DetailLabel>
              {RUN_POPOVER_TIMESTAMP_LABELS.scheduled}
            </styled.DetailLabel>
            <styled.DetailValue>
              {formatTimestamp(run.scheduledTimeMs)}
            </styled.DetailValue>
          </styled.DetailRow>
          <styled.DetailRow>
            <styled.DetailLabel>
              {RUN_POPOVER_TIMESTAMP_LABELS.started}
            </styled.DetailLabel>
            <styled.DetailValue>
              {formatTimestamp(run.startedTimeMs)}
            </styled.DetailValue>
          </styled.DetailRow>
          <styled.DetailRow>
            <styled.DetailLabel>
              {RUN_POPOVER_TIMESTAMP_LABELS.ended}
            </styled.DetailLabel>
            <styled.DetailValue>
              {formatTimestamp(run.endedTimeMs)}
            </styled.DetailValue>
          </styled.DetailRow>
        </styled.RunEntry>
      ))}
    </styled.Content>
  );
}
