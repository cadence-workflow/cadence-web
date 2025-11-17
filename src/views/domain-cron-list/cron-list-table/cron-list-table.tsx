'use client';
import React from 'react';

import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import Table from '@/components/table/table';
import useListWorkflows from '@/views/shared/hooks/use-list-workflows';

import cronListTableConfig from './config/cron-list-table.config';
import { type Props } from './cron-list-table.types';

const CRON_LIST_PAGE_SIZE = 20;
const CRON_LIST_QUERY = 'IsCron = "true" AND CloseTime = missing';

export default function CronListTable({ domain, cluster }: Props) {
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
    timeRangeEnd: new Date().toISOString(),
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
