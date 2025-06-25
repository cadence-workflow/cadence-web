'use client';
import React from 'react';

import { Button, KIND } from 'baseui/button';
import { MdRefresh } from 'react-icons/md';

import useConfigValue from '@/hooks/use-config-value/use-config-value';
import { resetWorkflowActionConfig } from '@/views/workflow-actions/config/workflow-actions.config';
import { useDescribeWorkflow } from '@/views/workflow-page/hooks/use-describe-workflow';

import type Props from './workflow-history-timeline-reset-button.types';

export default function WorkflowHistoryTimelineResetButton({
  onReset,
  workflowId,
  runId,
  domain,
  cluster,
}: Props) {
  const {
    data: workflow,
    isLoading: isWorkflowLoading,
    isError: isWorkflowError,
  } = useDescribeWorkflow({
    cluster,
    workflowId,
    runId,
    domain,
  });

  const {
    data: actionsEnabledConfig,
    isLoading: isActionsEnabledLoading,
    isError: isActionsEnabledError,
  } = useConfigValue('WORKFLOW_ACTIONS_ENABLED', {
    domain: domain,
    cluster: cluster,
  });

  const isResetRunnable =
    workflow &&
    resetWorkflowActionConfig.getRunnableStatus(workflow) === 'RUNNABLE';
  const isResetActionEnabled =
    actionsEnabledConfig?.[resetWorkflowActionConfig.id] === 'ENABLED';

  const isError = isWorkflowError || isActionsEnabledError;
  const isLoading = isWorkflowLoading || isActionsEnabledLoading;

  if (!isResetActionEnabled || !isResetRunnable || isError || isLoading) {
    return null;
  }

  return (
    <Button
      kind={KIND.secondary}
      onClick={(e) => {
        e.stopPropagation();
        onReset();
      }}
      startEnhancer={<MdRefresh />}
      size="mini"
    >
      Reset
    </Button>
  );
}
