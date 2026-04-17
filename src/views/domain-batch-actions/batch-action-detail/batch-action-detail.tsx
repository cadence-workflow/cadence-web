'use client';
import React from 'react';

import { useStyletron } from 'baseui';
import { MdCancel } from 'react-icons/md';

import Button from '@/components/button/button';

import { type BatchAction } from '../domain-batch-actions.types';

import { overrides, styled } from './batch-action-detail.styles';

type Props = {
  batchAction: BatchAction;
};

export default function BatchActionDetail({ batchAction }: Props) {
  const [_, theme] = useStyletron();

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
      <styled.DetailsSection />
      <styled.ProgressSection />
    </styled.Container>
  );
}
