'use client';
import React from 'react';

import { MdAdd, MdOutlineEdit } from 'react-icons/md';

import Button from '@/components/button/button';
import TableInfiniteScrollLoader from '@/components/table/table-infinite-scroll-loader/table-infinite-scroll-loader';

import DomainBatchActionsSidebarItem from '../domain-batch-actions-sidebar-item/domain-batch-actions-sidebar-item';
import StatusIcon from '../helpers/status-icon';

import { overrides, styled } from './domain-batch-actions-sidebar.styles';
import { type Props } from './domain-batch-actions-sidebar.types';

export default function DomainBatchActionsSidebar({
  batchActions,
  isDraftOpen,
  isDraftSelected,
  selectedActionId,
  onSelectAction,
  onSelectDraft,
  onCreateNew,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  error,
}: Props) {
  return (
    <styled.Container>
      <Button
        kind="secondary"
        size="compact"
        startEnhancer={<MdAdd />}
        overrides={overrides.newActionButton}
        onClick={onCreateNew}
      >
        New batch action
      </Button>
      <styled.SectionLabel>Batch history</styled.SectionLabel>
      <styled.List>
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
              // TODO: label should be either start date or provided from search attributes once available.
              label={action.runId}
              icon={<StatusIcon action={action} />}
              isSelected={isSelected}
              isActive={action.status === 'RUNNING' || isSelected}
              onSelect={() => onSelectAction(action.runId)}
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
