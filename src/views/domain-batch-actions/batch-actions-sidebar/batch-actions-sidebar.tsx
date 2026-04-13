'use client';
import React from 'react';

import { useStyletron } from 'baseui';
import { Spinner } from 'baseui/spinner';
import { MdAdd, MdCheckCircle, MdOutlineCancel } from 'react-icons/md';

import Button from '@/components/button/button';

import { type BatchAction } from '../domain-batch-actions.types';

import { overrides, styled } from './batch-actions-sidebar.styles';

type Props = {
  batchActions: BatchAction[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

function StatusIcon({ action }: { action: BatchAction }) {
  const [_, theme] = useStyletron();
  switch (action.status) {
    case 'completed':
      return (
        <MdCheckCircle
          size={theme.sizing.scale600}
          color={theme.colors.contentPositive}
        />
      );
    case 'aborted':
      return (
        <MdOutlineCancel
          size={theme.sizing.scale600}
          color={theme.colors.contentNegative}
        />
      );
    case 'running':
      return <Spinner $size={theme.sizing.scale600} />;
  }
}

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
