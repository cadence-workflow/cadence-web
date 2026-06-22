'use client';
import React from 'react';

import { useParams } from 'next/navigation';

import ErrorPanel from '@/components/error-panel/error-panel';
import PanelSection from '@/components/panel-section/panel-section';
import decodeUrlParams from '@/utils/decode-url-params';

import schedulePageTabsConfig from '../config/schedule-page-tabs.config';
import { type SchedulePageTabsParams } from '../schedule-page-tabs/schedule-page-tabs.types';

import { type Props } from './schedule-page-tabs-error.types';

export default function SchedulePageTabsError({ error, reset }: Props) {
  const params = useParams<SchedulePageTabsParams>();
  const decodedParams = decodeUrlParams(params);
  const tabConfig = schedulePageTabsConfig[decodedParams.scheduleTab];

  if (!tabConfig) {
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

  const errorConfig = tabConfig.getErrorConfig(error, decodedParams);

  return (
    <PanelSection>
      <ErrorPanel
        error={error}
        message={errorConfig.message}
        actions={errorConfig.actions}
        omitLogging={errorConfig.omitLogging}
        showErrorDetails={errorConfig.showErrorDetails}
        reset={reset}
      />
    </PanelSection>
  );
}
