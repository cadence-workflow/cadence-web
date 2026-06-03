import { type MouseEvent, useMemo } from 'react';

import { Checkbox } from 'baseui/checkbox';
import ChevronDown from 'baseui/icon/chevron-down';
import ChevronUp from 'baseui/icon/chevron-up';
import { StatefulTooltip } from 'baseui/tooltip';
import isNil from 'lodash/isNil';
import NextLink from 'next/link';

import TableInfiniteScrollLoader from '@/components/table/table-infinite-scroll-loader/table-infinite-scroll-loader';

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
              <styled.CheckboxCell>
                <Checkbox
                  checked={selection.isAllSelected}
                  onChange={selection.onToggleAll}
                  aria-label="Select all workflows"
                />
              </styled.CheckboxCell>
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
              // Toggling is handled by the cell's onClickCapture below (so we
              // can stop the surrounding link from navigating), hence the no-op
              // onChange.
              const rowCheckbox = selection && (
                <Checkbox
                  checked={selection.isSelected(workflow)}
                  disabled={selection.isRowToggleDisabled}
                  onChange={() => {}}
                  aria-label={`Select workflow ${workflow.workflowID}`}
                />
              );

              return (
                <styled.GridRow
                  key={`${workflow.workflowID}-${workflow.runID}-${index}`}
                  $as={NextLink}
                  href={`workflows/${encodeURIComponent(workflow.workflowID)}/${encodeURIComponent(workflow.runID)}`}
                  prefetch={false}
                  $gridTemplateColumns={gridTemplateColumns}
                >
                  {selection && (
                    <styled.CheckboxCell
                      // The row is a link and baseui's Checkbox stops click
                      // propagation, so intercept in the capture phase: prevent
                      // navigation and toggle selection ourselves.
                      onClickCapture={(e: MouseEvent) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!selection.isRowToggleDisabled) {
                          selection.onToggle(workflow);
                        }
                      }}
                    >
                      {selection.isRowToggleDisabled &&
                      selection.rowToggleDisabledReason ? (
                        <StatefulTooltip
                          placement="right"
                          showArrow
                          accessibilityType="tooltip"
                          content={selection.rowToggleDisabledReason}
                        >
                          {/* span so the tooltip can attach hover handlers — a
                              disabled checkbox does not receive them. */}
                          <span>{rowCheckbox}</span>
                        </StatefulTooltip>
                      ) : (
                        rowCheckbox
                      )}
                    </styled.CheckboxCell>
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
