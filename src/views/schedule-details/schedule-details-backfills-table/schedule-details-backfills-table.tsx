'use client';
import React, { useState, useCallback } from 'react';

import { Table } from 'baseui/table-semantic';

import Link from '@/components/link/link';

import { formatScheduleTimestamp } from '../helpers/format-schedule-timestamp';
import ScheduleDetailsSectionHeader from '../schedule-details-section-header/schedule-details-section-header';

import { BACKFILLS_TABLE_COLUMNS } from './schedule-details-backfills-table.constants';
import { overrides, styled } from './schedule-details-backfills-table.styles';
import { type Props } from './schedule-details-backfills-table.types';

export default function ScheduleDetailsBackfillsTable({
  backfills,
  domain,
  cluster,
}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onToggle = useCallback(() => {
    setIsCollapsed((current) => !current);
  }, []);

  if (backfills.length === 0) {
    return null;
  }

  const title = `Ongoing backfills (${backfills.length})`;

  return (
    <styled.Section>
      <ScheduleDetailsSectionHeader
        title={title}
        isCollapsed={isCollapsed}
        onToggle={onToggle}
      />
      {!isCollapsed && (
        <styled.TableContainer>
          <Table
            size="compact"
            divider="clean"
            overrides={overrides.table}
            columns={BACKFILLS_TABLE_COLUMNS}
            data={backfills.map((b) => [
              <Link
                key={b.backfillId}
                href={`/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows?input=query&query=${encodeURIComponent(`CadenceScheduleBackfillID="${b.backfillId}"`)}`}
              >
                {b.backfillId}
              </Link>,
              formatScheduleTimestamp(b.startTime) ?? '—',
              formatScheduleTimestamp(b.endTime) ?? '—',
              `${b.runsCompleted} of ${b.runsTotal}`,
            ])}
          />
        </styled.TableContainer>
      )}
    </styled.Section>
  );
}
