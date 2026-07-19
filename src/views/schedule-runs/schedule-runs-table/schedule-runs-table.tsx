'use client';

import { useMemo } from 'react';

import Table from '@/components/table/table';

import scheduleRunsTableConfig from '../config/schedule-runs-table.config';
import { type Props } from './schedule-runs-table.types';

export default function ScheduleRunsTable({
  domain,
  cluster,
  workflows,
  error,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: Props) {
  const data = useMemo(
    () => workflows.map((workflow) => ({ ...workflow, domain, cluster })),
    [workflows, domain, cluster]
  );

  return (
    <Table
      data={data}
      columns={scheduleRunsTableConfig}
      shouldShowResults={workflows.length > 0}
      endMessageProps={{
        kind: 'infinite-scroll',
        hasData: workflows.length > 0,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
      }}
    />
  );
}
