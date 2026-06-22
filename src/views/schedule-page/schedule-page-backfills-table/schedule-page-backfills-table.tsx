'use client';
import React from 'react';

import { Table } from 'baseui/table-semantic';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import SchedulePageDetailsSectionHeader from '../schedule-page-details-section-header/schedule-page-details-section-header';
import { formatScheduleTimestamp } from '../config/schedule-details-formatters';

import { cssStyles } from './schedule-page-backfills-table.styles';
import { type Props } from './schedule-page-backfills-table.types';

const BACKFILLS_TABLE_COLUMNS = [
  'Backfill ID',
  'Start time',
  'End time',
  'Progress',
];

const SECTION_TITLE = 'Ongoing backfills';

export default function SchedulePageBackfillsTable({ backfills }: Props) {
  const { cls } = useStyletronClasses(cssStyles);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const onToggle = React.useCallback(() => {
    setIsCollapsed((current) => !current);
  }, []);

  if (backfills.length === 0) {
    return null;
  }

  return (
    <section className={cls.section}>
      <SchedulePageDetailsSectionHeader
        title={SECTION_TITLE}
        isCollapsed={isCollapsed}
        onToggle={onToggle}
      />
      {!isCollapsed && (
        <div className={cls.tableContainer}>
          <Table
            size="compact"
            divider="clean"
            columns={BACKFILLS_TABLE_COLUMNS}
            data={backfills.map((b) => [
              b.backfillId,
              formatScheduleTimestamp(b.startTime) ?? '—',
              formatScheduleTimestamp(b.endTime) ?? '—',
              `${b.runsCompleted} / ${b.runsTotal}`,
            ])}
          />
        </div>
      )}
    </section>
  );
}
