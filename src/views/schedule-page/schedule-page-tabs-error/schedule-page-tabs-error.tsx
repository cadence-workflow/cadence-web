'use client';
import React from 'react';

import ErrorPanel from '@/components/error-panel/error-panel';
import PanelSection from '@/components/panel-section/panel-section';

import { type Props } from './schedule-page-tabs-error.types';

export default function SchedulePageTabsError({ error, reset }: Props) {
  return (
    <PanelSection>
      <ErrorPanel
        error={error}
        message="Failed to load schedule content"
        actions={[{ kind: 'retry', label: 'Retry' }]}
        reset={reset}
      />
    </PanelSection>
  );
}
