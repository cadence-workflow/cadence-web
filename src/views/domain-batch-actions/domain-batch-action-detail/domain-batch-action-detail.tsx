'use client';
import React from 'react';

import { MdCancel } from 'react-icons/md';

import Button from '@/components/button/button';

import DomainBatchActionHeaderInfo from '../domain-batch-action-header-info/domain-batch-action-header-info';

import { overrides, styled } from './domain-batch-action-detail.styles';
import { type Props } from './domain-batch-action-detail.types';

export default function DomainBatchActionDetail({ batchAction }: Props) {
  return (
    <styled.Container>
      <styled.Header>
        <styled.Title>Batch action #{batchAction.id}</styled.Title>
        {batchAction.status === 'running' && (
          <Button
            kind="primary"
            size="compact"
            overrides={overrides.abortButton}
            startEnhancer={<MdCancel />}
          >
            Abort batch action
          </Button>
        )}
      </styled.Header>
      <div>
        <DomainBatchActionHeaderInfo batchAction={batchAction} />
      </div>
      <styled.ProgressSection />
    </styled.Container>
  );
}
