'use client';
import React, { useState } from 'react';

import { StatefulTooltip } from 'baseui/tooltip';

import Button from '@/components/button/button';
import useConfigValue from '@/hooks/use-config-value/use-config-value';
import { startWorkflowActionConfig } from '@/views/workflow-actions/config/workflow-actions.config';
import getActionDisabledReason from '@/views/workflow-actions/workflow-actions-menu/helpers/get-action-disabled-reason';
import WorkflowActionsModal from '@/views/workflow-actions/workflow-actions-modal/workflow-actions-modal';

import type { Props } from './domain-page-start-workflow-button.types';

export default function DomainPageStartWorkflowButton({
  domain,
  cluster,
}: Props) {
  const [showStartNewWorkflowModal, setShowStartNewWorkflowModal] =
    useState(false);

  const {
    data: actionsEnabledConfig,
    isLoading: isActionsEnabledLoading,
    isError: isActionsEnabledError,
  } = useConfigValue('WORKFLOW_ACTIONS_ENABLED', {
    domain,
    cluster,
  });

  const disabledReason = getActionDisabledReason({
    actionEnabledConfig: actionsEnabledConfig?.start,
    actionRunnableStatus: 'RUNNABLE',
  });

  return (
    <>
      <StatefulTooltip
        content={disabledReason ?? null}
        ignoreBoundary
        placement="auto"
        showArrow
      >
        <div>
          <Button
            onClick={() => {
              setShowStartNewWorkflowModal(true);
            }}
            size="compact"
            kind="secondary"
            loadingIndicatorType="skeleton"
            isLoading={isActionsEnabledLoading || isActionsEnabledError}
            disabled={Boolean(disabledReason)}
            startEnhancer={<startWorkflowActionConfig.icon size={16} />}
            aria-label={disabledReason ?? undefined}
          >
            Start new workflow
          </Button>
        </div>
      </StatefulTooltip>
      {showStartNewWorkflowModal && (
        <WorkflowActionsModal
          domain={domain}
          cluster={cluster}
          runId=""
          workflowId=""
          action={startWorkflowActionConfig}
          onClose={() => {
            setShowStartNewWorkflowModal(false);
          }}
        />
      )}
    </>
  );
}
