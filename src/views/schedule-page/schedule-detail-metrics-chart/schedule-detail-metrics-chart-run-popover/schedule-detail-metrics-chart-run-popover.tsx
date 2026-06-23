import React from 'react';

import {
  MdAutorenew,
  MdCancel,
  MdCheckCircle,
  MdError,
  MdInfoOutline,
  MdPlayArrow,
  MdTimer,
} from 'react-icons/md';

import Link from '@/components/link/link';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import formatDate from '@/utils/data-formatters/format-date';
import {
  WORKFLOW_STATUS_NAMES,
  WORKFLOW_STATUSES,
} from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

import {
  RUN_POPOVER_BACKFILL_LABEL,
  RUN_POPOVER_TEST_IDS,
  RUN_POPOVER_TIMESTAMP_LABELS,
} from './schedule-detail-metrics-chart-run-popover.constants';
import { styled } from './schedule-detail-metrics-chart-run-popover.styles';
import { type Props } from './schedule-detail-metrics-chart-run-popover.types';

function formatTimestamp(timestampMs: number | null) {
  if (timestampMs == null) {
    return '—';
  }

  return formatDate(timestampMs);
}

export default function ScheduleDetailMetricsChartRunPopover({
  runs,
  domain,
  cluster,
}: Props) {
  const { theme } = useStyletronClasses({});

  return (
    <styled.Content data-testid={RUN_POPOVER_TEST_IDS.content}>
      {runs.map((run) => (
        <styled.RunEntry
          key={run.runId}
          data-testid={RUN_POPOVER_TEST_IDS.runEntry}
        >
          <styled.RunHeader>
            <styled.RunId>{run.runId}</styled.RunId>
            <styled.Status>
              <span data-testid={RUN_POPOVER_TEST_IDS.statusIcon}>
                <StatusIcon status={run.status} />
              </span>
              <span>{WORKFLOW_STATUS_NAMES[run.status]}</span>
            </styled.Status>
          </styled.RunHeader>
          {run.backfillId != null && (
            <styled.BackfillRow>
              <styled.TimestampLabel>
                {RUN_POPOVER_BACKFILL_LABEL}
              </styled.TimestampLabel>
              <Link
                href={`/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows?input=query&query=${encodeURIComponent(`CadenceScheduleBackfillID="${run.backfillId}"`)}`}
              >
                {run.backfillId}
              </Link>
            </styled.BackfillRow>
          )}
          <styled.TimestampRow>
            <styled.TimestampLabel>
              {RUN_POPOVER_TIMESTAMP_LABELS.scheduled}
            </styled.TimestampLabel>
            <styled.TimestampValue>
              {formatTimestamp(run.scheduledTimeMs)}
            </styled.TimestampValue>
          </styled.TimestampRow>
          <styled.TimestampRow>
            <styled.TimestampLabel>
              {RUN_POPOVER_TIMESTAMP_LABELS.started}
            </styled.TimestampLabel>
            <styled.TimestampValue>
              {formatTimestamp(run.startedTimeMs)}
            </styled.TimestampValue>
          </styled.TimestampRow>
          <styled.TimestampRow>
            <styled.TimestampLabel>
              {RUN_POPOVER_TIMESTAMP_LABELS.ended}
            </styled.TimestampLabel>
            <styled.TimestampValue>
              {formatTimestamp(run.endedTimeMs)}
            </styled.TimestampValue>
          </styled.TimestampRow>
        </styled.RunEntry>
      ))}
    </styled.Content>
  );

  function StatusIcon({ status }: { status: WorkflowStatus }) {
    switch (status) {
      case WORKFLOW_STATUSES.completed:
        return <MdCheckCircle color={theme.colors.contentPositive} size={14} />;
      case WORKFLOW_STATUSES.failed:
        return <MdError color={theme.colors.contentNegative} size={14} />;
      case WORKFLOW_STATUSES.canceled:
      case WORKFLOW_STATUSES.terminated:
        return <MdCancel color={theme.colors.contentWarning} size={14} />;
      case WORKFLOW_STATUSES.continuedAsNew:
        return <MdAutorenew color={theme.colors.contentAccent} size={14} />;
      case WORKFLOW_STATUSES.timedOut:
        return <MdTimer color={theme.colors.contentWarning} size={14} />;
      case WORKFLOW_STATUSES.running:
        return <MdPlayArrow color={theme.colors.contentAccent} size={14} />;
      default:
        return <MdInfoOutline color={theme.colors.contentSecondary} size={14} />;
    }
  }
}
