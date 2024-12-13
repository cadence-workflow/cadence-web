'use client';
import React from 'react';

import Table from '@/components/table/table';

import workflowsTableNonSortableConfig from './config/workflows-table-non-sortable.config';
import workflowsTableSortableConfig from './config/workflows-table-sortable.config';
import { styled } from './workflows-table.styles';
import { type Props } from './workflows-table.types';

export default function WorkflowsTable({
  workflows,
  isLoading,
  error,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  sortParams,
}: Props) {
  return (
    <styled.TableContainer>
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
        {...(sortParams !== undefined
          ? {
              columns: workflowsTableSortableConfig,
              onSort: sortParams.onSort,
              sortColumn: sortParams.sortColumn,
              sortOrder: sortParams.sortOrder,
            }
          : {
              columns: workflowsTableNonSortableConfig,
            })}
      />
    </styled.TableContainer>
  );
}
