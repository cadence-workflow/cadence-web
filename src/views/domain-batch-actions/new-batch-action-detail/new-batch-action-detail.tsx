'use client';
import React from 'react';

import { MdDeleteOutline } from 'react-icons/md';

import Button from '@/components/button/button';

import { overrides, styled } from './new-batch-action-detail.styles';
import { type Props } from './new-batch-action-detail.types';
import NewBatchActionInfoBanner from './new-batch-action-info-banner/new-batch-action-info-banner';

export default function NewBatchActionDetail({ onDiscard }: Props) {
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
      <NewBatchActionInfoBanner />
    </styled.Container>
  );
}
