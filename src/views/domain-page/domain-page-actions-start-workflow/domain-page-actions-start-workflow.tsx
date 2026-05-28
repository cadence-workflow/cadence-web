import { useState } from 'react';

import useConfigValue from '@/hooks/use-config-value/use-config-value';
import { startWorkflowActionConfig } from '@/views/workflow-actions/config/workflow-actions.config';
import getActionDisabledReason from '@/views/workflow-actions/workflow-actions-menu/helpers/get-action-disabled-reason';
import WorkflowActionsModal from '@/views/workflow-actions/workflow-actions-modal/workflow-actions-modal';

import { type DomainPageActionButtonProps } from '../domain-page-actions-dropdown/domain-page-actions-dropdown.types';
import DomainPageBaseActionButton from '../domain-page-base-action-button/domain-page-base-action-button';

export default function DomainPageActionsStartWorkflow({
  domain,
  cluster,
  label,
  icon,
}: DomainPageActionButtonProps) {
  const [showStartNewWorkflowModal, setShowStartNewWorkflowModal] =
    useState(false);

  const {
    data: actionsEnabledConfig,
    isLoading,
    isError,
  } = useConfigValue('WORKFLOW_ACTIONS_ENABLED', {
    domain,
    cluster,
  });

  const startDisabledReason = getActionDisabledReason({
    actionEnabledConfig: actionsEnabledConfig?.start,
    actionRunnableStatus: 'RUNNABLE',
  });

  const buttonDisabledReason =
    isLoading || isError ? 'Action Unavailable' : undefined;

  return (
    <>
      <DomainPageBaseActionButton
        label={label}
        icon={icon}
        disabledReason={startDisabledReason ?? buttonDisabledReason}
        onClick={() => setShowStartNewWorkflowModal(true)}
      />
      {/* Note: Placing the modal as a sibling to the button means if the menu button unmounts (e.g., on menu close), the modal will unmount and close too. */}
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
