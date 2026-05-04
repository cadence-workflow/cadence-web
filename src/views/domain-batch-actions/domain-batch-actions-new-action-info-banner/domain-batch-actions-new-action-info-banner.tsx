'use client';
import React, { useState } from 'react';

import { MdDirectionsRun } from 'react-icons/md';

import Button from '@/components/button/button';

import {
  overrides,
  styled,
} from './domain-batch-actions-new-action-info-banner.styles';

export default function DomainBatchActionsNewActionInfoBanner() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <styled.Banner>
      <styled.Content>
        <styled.IconContainer>
          <MdDirectionsRun />
        </styled.IconContainer>
        <styled.TextContainer>
          <styled.Title>
            Batch actions can only be submitted for running workflows
          </styled.Title>
          <styled.Subtitle>
            That means that the workflows listed below are subject to change. If
            a workflow changes state from running, it will be ignored. Only
            selected workflows will be submitted.
          </styled.Subtitle>
        </styled.TextContainer>
      </styled.Content>
      <Button
        kind="secondary"
        size="compact"
        shape="pill"
        overrides={overrides.dismissButton}
        onClick={() => setIsDismissed(true)}
      >
        Got it!
      </Button>
    </styled.Banner>
  );
}
