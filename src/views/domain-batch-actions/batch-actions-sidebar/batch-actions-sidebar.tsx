'use client';
import React from 'react';

import { MdAdd } from 'react-icons/md';

import Button from '@/components/button/button';

import { type BatchAction } from '../domain-batch-actions.types';
import StatusIcon from '../helpers/status-icon';

import { overrides, styled } from './batch-actions-sidebar.styles';

type Props = {
  batchActions: BatchAction[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function BatchActionsSidebar({
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
          <styled.ListItem
            key={action.id}
            $isSelected={action.id === selectedId}
            onClick={() => onSelect(action.id)}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') onSelect(action.id);
            }}
            role="button"
            tabIndex={0}
            $isActive={action.status === 'running' || action.id === selectedId}
          >
            <StatusIcon action={action} />
            Batch action #{action.id}
          </styled.ListItem>
        ))}
      </styled.List>
    </styled.Container>
  );
}
