import { useMemo } from 'react';

import ChevronDown from 'baseui/icon/chevron-down';
import ChevronUp from 'baseui/icon/chevron-up';
import isNil from 'lodash/isNil';
import NextLink from 'next/link';

import TableInfiniteScrollLoader from '@/components/table/table-infinite-scroll-loader/table-infinite-scroll-loader';

import { styled } from './workflows-list.styles';
import { type Props, type WorkflowsListColumn } from './workflows-list.types';

export default function WorkflowsList({
  workflows,
  columns,
  error,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  sortParams,
}: Props) {
  const gridTemplateColumns = useMemo(
    () => columns.map((col) => col.width).join(' '),
    [columns]
  );

  const hasWorkflows = workflows.length > 0;

  return (
    <div>
      <styled.ScrollArea>
        <styled.Container>
          <styled.GridHeader $gridTemplateColumns={gridTemplateColumns}>
            {columns.map((col: WorkflowsListColumn) => {
              if (col.sortable && sortParams) {
                const isActive = sortParams.sortColumn === col.id;

                let SortIcon = null,
                  ariaSortAttribute: 'ascending' | 'descending' | 'none' =
                    'none';

                if (isActive && sortParams.sortOrder === 'ASC') {
                  SortIcon = ChevronUp;
                  ariaSortAttribute = 'ascending';
                } else if (isActive && sortParams.sortOrder === 'DESC') {
                  SortIcon = ChevronDown;
                  ariaSortAttribute = 'descending';
                }

                return (
                  <styled.SortableHeaderCell
                    key={col.id}
                    onClick={() => sortParams.onSort(col.id)}
                    aria-sort={ariaSortAttribute}
                  >
                    {col.name}
                    {SortIcon && (
                      <SortIcon
                        size="16px"
                        aria-hidden="true"
                        role="presentation"
                      />
                    )}
                  </styled.SortableHeaderCell>
                );
              }

              return (
                <styled.HeaderCell key={col.id}>{col.name}</styled.HeaderCell>
              );
            })}
          </styled.GridHeader>
          {hasWorkflows &&
            workflows.map((workflow, index) => (
              <styled.GridRow
                key={`${workflow.workflowID}-${workflow.runID}-${index}`}
                $as={NextLink}
                href={`workflows/${encodeURIComponent(workflow.workflowID)}/${encodeURIComponent(workflow.runID)}`}
                prefetch={false}
                $gridTemplateColumns={gridTemplateColumns}
              >
                {columns.map((col) => {
                  const content = col.renderCell(workflow);
                  return (
                    <styled.GridCell key={col.id}>
                      {isNil(content) ? (
                        <styled.CellPlaceholder>None</styled.CellPlaceholder>
                      ) : (
                        content
                      )}
                    </styled.GridCell>
                  );
                })}
              </styled.GridRow>
            ))}
        </styled.Container>
      </styled.ScrollArea>
      <styled.FooterContainer>
        <TableInfiniteScrollLoader
          hasData={hasWorkflows}
          error={error}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </styled.FooterContainer>
    </div>
  );
}
