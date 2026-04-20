'use client';
import React from 'react';

import { MdAdd, MdOutlineEdit } from 'react-icons/md';
import { MdAdd, MdOutlineEdit } from 'react-icons/md';

import Button from '@/components/button/button';

import StatusIcon from '../helpers/status-icon';

import BatchActionsSidebarItem from './batch-actions-sidebar-item/batch-actions-sidebar-item';
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
}: Props) {
  return (
    <styled.Container>
      <Button
        kind="secondary"
        size="compact"
        startEnhancer={<MdAdd />}
        overrides={overrides.newActionButton}
        onClick={onCreateNew}
        onClick={onCreateNew}
      >
        New batch action
      </Button>
      <styled.SectionLabel>Batch history</styled.SectionLabel>
      <styled.List>
        {isDraftOpen && (
          <BatchActionsSidebarItem
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
          const isSelected = !isDraftSelected && selectedActionId === action.id;
          return (
            <BatchActionsSidebarItem
              key={action.id}
              label={`Batch action #${action.id}`}
              icon={<StatusIcon action={action} />}
              isSelected={isSelected}
              isActive={action.status === 'running' || isSelected}
              onSelect={() => onSelectAction(action.id)}
            />
          );
        })}
      </styled.List>
    </styled.Container>
  );
}
