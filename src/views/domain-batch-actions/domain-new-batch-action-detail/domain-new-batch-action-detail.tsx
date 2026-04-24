'use client';
import React from 'react';

import { MdDeleteOutline } from 'react-icons/md';

import Button from '@/components/button/button';

import DomainNewBatchActionInfoBanner from '../domain-new-batch-action-info-banner/domain-new-batch-action-info-banner';

import { overrides, styled } from './domain-new-batch-action-detail.styles';
import { type Props } from './domain-new-batch-action-detail.types';

export default function DomainNewBatchActionDetail({ onDiscard }: Props) {
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
      <DomainNewBatchActionInfoBanner />
    </styled.Container>
  );
}
