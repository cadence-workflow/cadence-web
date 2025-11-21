'use client';
import React, { useMemo } from 'react';

import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import Table from '@/components/table/table';
import useListWorkflows from '@/views/shared/hooks/use-list-workflows';

import cronListTableConfig from '../config/cron-list-table.config';

import {
  CRON_LIST_PAGE_SIZE,
  CRON_LIST_QUERY,
} from './cron-list-table.constants';
import { type Props } from './cron-list-table.types';

export default function CronListTable({ domain, cluster }: Props) {
  const timeRangeEnd = useMemo(() => new Date().toISOString(), []);

  const {
    workflows,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useListWorkflows({
    domain,
    cluster,
    listType: 'default',
    pageSize: CRON_LIST_PAGE_SIZE,
    inputType: 'query',
    timeRangeEnd,
    query: CRON_LIST_QUERY,
  });

  if (isLoading) {
    return <SectionLoadingIndicator />;
  }

  return (
    <Table
      data={workflows}
      shouldShowResults={!isLoading && workflows.length > 0}
      endMessageProps={{
        kind: 'infinite-scroll',
        hasData: workflows.length > 0,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
      }}
      columns={cronListTableConfig}
    />
  );
}
