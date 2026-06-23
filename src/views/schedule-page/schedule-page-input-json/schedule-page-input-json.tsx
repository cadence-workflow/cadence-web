'use client';
import React, { useMemo } from 'react';

import WorkflowSummaryJsonView from '@/views/workflow-summary/workflow-summary-json-view/workflow-summary-json-view';

import { formatScheduleInput } from '../config/schedule-details-formatters';

import { type Props } from './schedule-page-input-json.types';

export default function SchedulePageInputJson({ input, domain, cluster }: Props) {
  const parsedInput = useMemo(() => formatScheduleInput(input), [input]);

  if (parsedInput === null || parsedInput === undefined) {
    return null;
  }

  return (
    <WorkflowSummaryJsonView
      inputJson={parsedInput}
      resultJson={null}
      isWorkflowRunning={false}
      isWorkflowError={false}
      isArchived={false}
      domain={domain}
      cluster={cluster}
      workflowId=""
      runId=""
      defaultTab="input"
      hideTabToggle
    />
  );
}
