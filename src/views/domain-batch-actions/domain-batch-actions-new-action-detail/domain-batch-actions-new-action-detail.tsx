'use client';
import React from 'react';

import { MdDeleteOutline } from 'react-icons/md';

import Button from '@/components/button/button';

import DomainBatchActionsNewActionInfoBanner from '../domain-batch-actions-new-action-info-banner/domain-batch-actions-new-action-info-banner';

import {
  overrides,
  styled,
} from './domain-batch-actions-new-action-detail.styles';
import { type Props } from './domain-batch-actions-new-action-detail.types';

export default function DomainBatchActionsNewActionDetail({
  onDiscard,
}: Props) {
  return (
    <styled.Container>
      <styled.Header>
        <styled.Title>New batch action</styled.Title>
        <Button
          kind="secondary"
          size="compact"
          overrides={overrides.discardButton}
          startEnhancer={<MdDeleteOutline />}
          onClick={onDiscard}
        >
          Discard batch action
        </Button>
      </styled.Header>
      <DomainBatchActionsNewActionInfoBanner />
    </styled.Container>
  );
}
