'use client';
import React, { useMemo } from 'react';

import WorkflowSummaryJsonView from '@/views/workflow-summary/workflow-summary-json-view/workflow-summary-json-view';

import { type PrettyJsonValue } from '@/components/pretty-json/pretty-json.types';

import { formatScheduleInput } from '../helpers/format-schedule-input';

import { type Props } from './schedule-details-input-json.types';

export default function ScheduleDetailsInputJson({ input, domain, cluster }: Props) {
  const parsedInput = useMemo(() => formatScheduleInput(input), [input]);

  if (parsedInput === null || parsedInput === undefined) {
    return null;
  }

  return (
    <WorkflowSummaryJsonView
      inputJson={parsedInput as PrettyJsonValue}
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
