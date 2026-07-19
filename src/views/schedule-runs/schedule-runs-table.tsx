'use client';

import Table from '@/components/table/table';

import getScheduleRunsTableConfig from './config/schedule-runs-table.config';
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
  return (
    <Table
      data={workflows}
      columns={getScheduleRunsTableConfig(domain, cluster)}
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
