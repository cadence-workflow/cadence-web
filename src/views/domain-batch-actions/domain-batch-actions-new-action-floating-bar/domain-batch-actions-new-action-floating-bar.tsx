'use client';
import React from 'react';

import Button from '@/components/button/button';

import {
  overrides,
  styled,
} from './domain-batch-actions-new-action-floating-bar.styles';
import { type Props } from './domain-batch-actions-new-action-floating-bar.types';

export default function DomainBatchActionsNewActionFloatingBar({
  selectedCount,
  totalCount,
  actions,
  onActionClick,
}: Props) {
  return (
    <styled.Container role="region" aria-label="Batch action floating bar">
      <styled.Summary>
        {selectedCount} of {totalCount} workflows included
      </styled.Summary>
      <styled.Actions>
        {actions.map((action) => (
          <Button
            key={action.id}
            kind="primary"
            shape="pill"
            size="compact"
            overrides={overrides.actionButton}
            startEnhancer={<action.icon />}
            onClick={() => onActionClick(action.id)}
          >
            {action.label}
          </Button>
        ))}
      </styled.Actions>
    </styled.Container>
  );
}
