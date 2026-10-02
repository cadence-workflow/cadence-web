'use client';
import React, { useEffect, useMemo } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { MdAdd, MdOutlineEdit } from 'react-icons/md';

import Button from '@/components/button/button';
import TableInfiniteScrollLoader from '@/components/table/table-infinite-scroll-loader/table-infinite-scroll-loader';
import formatDate from '@/utils/data-formatters/format-date';

import DomainBatchActionsSidebarItem from '../domain-batch-actions-sidebar-item/domain-batch-actions-sidebar-item';
import StatusIcon from '../helpers/status-icon';

import { overrides, styled } from './domain-batch-actions-sidebar.styles';
import { type Props } from './domain-batch-actions-sidebar.types';

export default function DomainBatchActionsSidebar({
  batchActions,
  isDraftOpen,
  isDraftSelected,
  selectedActionId,
  selectedActionDetailStatus,
  onSelectAction,
  onSelectDraft,
  onCreateNew,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  error,
}: Props) {
  const queryClient = useQueryClient();

  // The list and the open detail poll independently, so one can lag the other
  // after a status change (e.g. the sidebar already shows COMPLETED while the
  // detail still shows RUNNING, or vice versa). When the selected action's two
  // copies disagree, refetch both so whichever is stale catches up immediately
  // instead of waiting for its next poll. Keyed on selectedActionId too, so
  // re-selecting an action re-checks it even when another action happened to
  // share the same status pair (which wouldn't change the deps otherwise).
  const selectedActionListStatus = useMemo(
    () =>
      batchActions.find((action) => action.runId === selectedActionId)?.status,
    [batchActions, selectedActionId]
  );
  useEffect(() => {
    if (
      selectedActionDetailStatus &&
      selectedActionListStatus &&
      selectedActionDetailStatus !== selectedActionListStatus
    ) {
      queryClient.invalidateQueries({ queryKey: ['listBatchActions'] });
      queryClient.invalidateQueries({ queryKey: ['describeBatchAction'] });
    }
  }, [
    selectedActionId,
    selectedActionDetailStatus,
    selectedActionListStatus,
    queryClient,
  ]);

  return (
    <styled.Container>
      <Button
        kind="secondary"
        size="compact"
        startEnhancer={<MdAdd />}
        overrides={overrides.newActionButton}
        onClick={onCreateNew}
        data-tour="batch-new-action-button"
      >
        New batch action
      </Button>
      <styled.SectionLabel>Batch history</styled.SectionLabel>
      <styled.List data-tour="batch-history">
        {isDraftOpen && (
          <DomainBatchActionsSidebarItem
            label="Untitled batch action"
            icon={
              <styled.DraftIcon>
                <MdOutlineEdit />
              </styled.DraftIcon>
            }
            isSelected={isDraftSelected}
            isActive
            onSelect={onSelectDraft}
          />
        )}
        {batchActions.map((action) => {
          const isSelected =
            !isDraftSelected && selectedActionId === action.runId;
          return (
            <DomainBatchActionsSidebarItem
              key={action.runId}
              label={formatDate(action.startTime)}
              subLabel={action.runId}
              icon={<StatusIcon action={action} />}
              isSelected={isSelected}
              isActive={action.status === 'RUNNING' || isSelected}
              onSelect={() => onSelectAction(action)}
            />
          );
        })}
        {(hasNextPage || isFetchingNextPage || error) && (
          <styled.LoaderWrapper>
            <TableInfiniteScrollLoader
              hasData={batchActions.length > 0}
              error={error}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          </styled.LoaderWrapper>
        )}
      </styled.List>
    </styled.Container>
  );
}
