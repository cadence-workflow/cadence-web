'use client';
import React, { useMemo } from 'react';

import Table from '@/components/table/table';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import sortBy, { toggleSortOrder } from '@/utils/sort-by';

import taskListPageQueryParamsConfig from '../config/task-list-page-query-params.config';
import taskListWorkersTableConfig from '../config/task-list-workers-table.config';
import isValidTableColumn from '../helpers/is-valid-table-column';

import filterWorkers from './helpers/filter-workers';
import { styled } from './task-list-workers-table.styles';
import { type Props } from './task-list-workers-table.types';

export default function TaskListWorkersTable({ taskList }: Props) {
  const [queryParams, setQueryParams] = usePageQueryParams(
    taskListPageQueryParamsConfig
  );

  const filteredAndSortedWorkers = useMemo(
    () =>
      sortBy(
        filterWorkers({
          workers: taskList.workers,
          handlerType: queryParams.handlerType,
          search: queryParams.taskListSearch,
        }),
        (w) => w[queryParams.sortColumn],
        queryParams.sortOrder
      ),
    [queryParams, taskList.workers]
  );

  return (
    <styled.TableContainer>
      <Table
        data={filteredAndSortedWorkers}
        columns={taskListWorkersTableConfig}
        shouldShowResults={true}
        sortColumn={queryParams.sortColumn}
        sortOrder={queryParams.sortOrder}
        onSort={(column) =>
          setQueryParams({
            sortColumn: isValidTableColumn(column) ? column : undefined,
            sortOrder: toggleSortOrder({
              currentSortColumn: queryParams.sortColumn,
              currentSortOrder: queryParams.sortOrder,
              newSortColumn: column,
            }),
          })
        }
        endMessageProps={{
          kind: 'simple',
          content:
            filteredAndSortedWorkers.length === 0 ? (
              <styled.EndMessageContainer>
                No workers
              </styled.EndMessageContainer>
            ) : null,
        }}
      />
    </styled.TableContainer>
  );
}
