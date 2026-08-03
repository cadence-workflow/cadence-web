'use client';
import React from 'react';

import { useStyletron } from 'baseui';
import { MdOpenInNew } from 'react-icons/md';

import Link from '@/components/link/link';
import WorkflowStatusTag from '@/views/shared/workflow-status-tag/workflow-status-tag';

import getRunPopoverTimestampRows from './helpers/get-run-popover-timestamp-rows';
import {
  RUN_POPOVER_BACKFILL_LABEL,
  RUN_POPOVER_NEXT_LABEL,
  RUN_POPOVER_SKIPPED_LABEL,
  RUN_POPOVER_STATUS_LABEL,
  RUN_POPOVER_TEST_IDS,
} from './schedule-details-runs-chart-run-popover.constants';
import { styled } from './schedule-details-runs-chart-run-popover.styles';
import {
  type PopoverEntryProps,
  type Props,
} from './schedule-details-runs-chart-run-popover.types';

function PopoverEntry({ title, rows }: PopoverEntryProps) {
  return (
    <styled.Entry data-testid={RUN_POPOVER_TEST_IDS.entry}>
      <styled.EntryTitle>{title}</styled.EntryTitle>
      {rows.map(({ label, value }) => (
        <React.Fragment key={label}>
          <styled.RowLabel>{label}</styled.RowLabel>
          <styled.RowValue>{value}</styled.RowValue>
        </React.Fragment>
      ))}
    </styled.Entry>
  );
}

export default function ScheduleDetailsRunsChartRunPopover({
  entries,
  domain,
  cluster,
}: Props) {
  const [, theme] = useStyletron();

  return (
    <styled.Content data-testid={RUN_POPOVER_TEST_IDS.content}>
      {entries.map((entry) => {
        if (entry.kind !== 'run') {
          return (
            <PopoverEntry
              key={`${entry.kind}-${entry.scheduledTimeMs}`}
              title={
                entry.kind === 'skipped'
                  ? RUN_POPOVER_SKIPPED_LABEL
                  : RUN_POPOVER_NEXT_LABEL
              }
              rows={getRunPopoverTimestampRows({
                scheduledTimeMs: entry.scheduledTimeMs,
                startedTimeMs: null,
                endedTimeMs: null,
              })}
            />
          );
        }

        const { run } = entry;

        return (
          <PopoverEntry
            key={run.runId}
            title={
              <Link
                href={`/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows/${encodeURIComponent(run.workflowId)}/${encodeURIComponent(run.runId)}`}
              >
                {run.runId}
              </Link>
            }
            rows={[
              {
                label: RUN_POPOVER_STATUS_LABEL,
                value: (
                  <span data-testid={RUN_POPOVER_TEST_IDS.statusIcon}>
                    <WorkflowStatusTag status={run.status} />
                  </span>
                ),
              },
              ...(run.backfillId != null
                ? [
                    {
                      label: RUN_POPOVER_BACKFILL_LABEL,
                      value: (
                        <styled.ValueWithIcon>
                          <Link
                            href={`/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows?input=query&query=${encodeURIComponent(`CadenceScheduleBackfillID="${run.backfillId}"`)}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {run.backfillId}
                          </Link>
                          <MdOpenInNew
                            size={theme.sizing.scale500}
                            color={theme.colors.contentPrimary}
                            aria-hidden
                          />
                        </styled.ValueWithIcon>
                      ),
                    },
                  ]
                : []),
              ...getRunPopoverTimestampRows(run),
            ]}
          />
        );
      })}
    </styled.Content>
  );
}
