'use client';
import React from 'react';

import { StyledLink } from 'baseui/link';
import { Table } from 'baseui/table-semantic';
import Link from 'next/link';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import SchedulePageDetailsSectionHeader from '../schedule-page-details-section-header/schedule-page-details-section-header';
import { formatScheduleTimestamp } from '../config/schedule-details-formatters';

import { cssStyles, overrides } from './schedule-page-backfills-table.styles';
import { type Props } from './schedule-page-backfills-table.types';

const BACKFILLS_TABLE_COLUMNS = [
  'Backfill ID',
  'Start time',
  'End time',
  'Completed',
];

export default function SchedulePageBackfillsTable({
  backfills,
  domain,
  cluster,
}: Props) {
  const { cls } = useStyletronClasses(cssStyles);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const onToggle = React.useCallback(() => {
    setIsCollapsed((current) => !current);
  }, []);

  if (backfills.length === 0) {
    return null;
  }

  const title = `Ongoing backfills (${backfills.length})`;

  return (
    <section className={cls.section}>
      <SchedulePageDetailsSectionHeader
        title={title}
        isCollapsed={isCollapsed}
        onToggle={onToggle}
      />
      {!isCollapsed && (
        <div className={cls.tableContainer}>
          <Table
            size="compact"
            divider="clean"
            overrides={overrides.table}
            columns={BACKFILLS_TABLE_COLUMNS}
            data={backfills.map((b) => [
              <StyledLink
                key={b.backfillId}
                $as={Link}
                href={`/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows?input=query&query=${encodeURIComponent(`CadenceScheduleBackfillID="${b.backfillId}"`)}`}
              >
                {b.backfillId}
              </StyledLink>,
              formatScheduleTimestamp(b.startTime) ?? '—',
              formatScheduleTimestamp(b.endTime) ?? '—',
              `${b.runsCompleted} of ${b.runsTotal}`,
            ])}
          />
        </div>
      )}
    </section>
  );
}
