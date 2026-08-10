import { useMemo } from 'react';

import { Checkbox } from 'baseui/checkbox';
import ChevronDown from 'baseui/icon/chevron-down';
import ChevronUp from 'baseui/icon/chevron-up';
import isNil from 'lodash/isNil';
import NextLink from 'next/link';

import TableInfiniteScrollLoader from '@/components/table/table-infinite-scroll-loader/table-infinite-scroll-loader';

import WorkflowsListSelectionCell from './workflows-list-selection-cell/workflows-list-selection-cell';
import { styled as selectionCellStyled } from './workflows-list-selection-cell/workflows-list-selection-cell.styles';
import { styled } from './workflows-list.styles';
import { type Props } from './workflows-list.types';

export default function WorkflowsList({
  workflows,
  columns,
  error,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  sortParams,
  selection,
}: Props) {
  const gridTemplateColumns = useMemo(() => {
    const columnWidths = columns.map((col) => col.width);
    if (selection) {
      // 'auto' sizes this track to the checkbox cell's themed width
      // (see CheckboxCell in workflows-list.styles.ts).
      columnWidths.unshift('auto');
    }
    return columnWidths.join(' ');
  }, [columns, selection]);

  const hasWorkflows = workflows.length > 0;

  return (
    <div>
      <styled.ScrollArea>
        <styled.Container>
          <styled.GridHeader $gridTemplateColumns={gridTemplateColumns}>
            {/* TODO: once baseui is upgraded to >=16.1, switch to checkbox-v2
                (baseui/checkbox-v2) and use `isIndeterminate` here for the
                some-but-not-all-selected state, and `containsInteractiveElement`
                on the per-row checkbox below to drop the capture-phase
                preventDefault workaround. */}
            {selection && (
              <selectionCellStyled.CheckboxCell>
                <Checkbox
                  checked={selection.isAllSelected}
                  onChange={selection.onToggleAll}
                  aria-label="Select all workflows"
                />
              </selectionCellStyled.CheckboxCell>
            )}
            {columns.map((col) => {
              if (col.sortable && sortParams) {
                const isActive = sortParams.sortColumn === col.id;

                let SortIcon = null;
                let ariaSortAttribute: 'ascending' | 'descending' | 'none' =
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
            workflows.map((workflow, index) => {
              return (
                <styled.GridRow
                  key={`${workflow.workflowID}-${workflow.runID}-${index}`}
                  $as={NextLink}
                  href={`workflows/${encodeURIComponent(workflow.workflowID)}/${encodeURIComponent(workflow.runID)}`}
                  prefetch={false}
                  $gridTemplateColumns={gridTemplateColumns}
                >
                  {selection && (
                    <WorkflowsListSelectionCell
                      selection={selection}
                      workflow={workflow}
                    />
                  )}
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
              );
            })}
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
