'use client';
import React from 'react';

import { MdAdd } from 'react-icons/md';

import Button from '@/components/button/button';

import StatusIcon from '../helpers/status-icon';

import BatchActionsSidebarItem from './batch-actions-sidebar-item/batch-actions-sidebar-item';
import { overrides, styled } from './domain-batch-actions-sidebar.styles';
import { type Props } from './domain-batch-actions-sidebar.types';

export default function DomainBatchActionsSidebar({
  batchActions,
  selectedId,
  onSelect,
}: Props) {
  return (
    <styled.Container>
      <Button
        kind="secondary"
        size="compact"
        startEnhancer={<MdAdd />}
        overrides={overrides.newActionButton}
      >
        New batch action
      </Button>
      <styled.SectionLabel>Batch history</styled.SectionLabel>
      <styled.List>
        {batchActions.map((action) => (
          <BatchActionsSidebarItem
            key={action.id}
            id={action.id}
            label={`Batch action #${action.id}`}
            icon={<StatusIcon action={action} />}
            isSelected={selectedId === action.id}
            isActive={action.status === 'running' || selectedId === action.id}
            onSelect={onSelect}
          />
        ))}
      </styled.List>
    </styled.Container>
  );
}
