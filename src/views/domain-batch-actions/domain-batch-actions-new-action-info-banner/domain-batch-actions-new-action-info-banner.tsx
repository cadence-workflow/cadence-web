'use client';
import React, { useState } from 'react';

import { MdDirectionsRun } from 'react-icons/md';

import DomainBatchActionsBanner from '../domain-batch-actions-banner/domain-batch-actions-banner';

import { styled } from './domain-batch-actions-new-action-info-banner.styles';

export default function DomainBatchActionsNewActionInfoBanner() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <DomainBatchActionsBanner
      icon={<MdDirectionsRun />}
      actionLabel="Got it!"
      onActionClick={() => setIsDismissed(true)}
    >
      <styled.TextContainer>
        <styled.Title>
          Batch actions can only be submitted for running workflows
        </styled.Title>
        <styled.Subtitle>
          That means that the workflows listed below are subject to change. If a
          workflow changes state from running, it will be ignored.
        </styled.Subtitle>
      </styled.TextContainer>
    </DomainBatchActionsBanner>
  );
}
