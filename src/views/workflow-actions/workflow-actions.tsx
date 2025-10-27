'use client';
import React, { useState } from 'react';

import {
  StatefulPopover,
  PLACEMENT as POPOVER_PLACEMENT,
} from 'baseui/popover';
import pick from 'lodash/pick';
import { useParams } from 'next/navigation';
import { MdArrowDropDown } from 'react-icons/md';

import Button from '@/components/button/button';
import useConfigValue from '@/hooks/use-config-value/use-config-value';
import { useDescribeWorkflow } from '@/views/workflow-page/hooks/use-describe-workflow';
import { type WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

import WorkflowActionsMenu from './workflow-actions-menu/workflow-actions-menu';
import WorkflowActionsModal from './workflow-actions-modal/workflow-actions-modal';
import { overrides } from './workflow-actions.styles';
import { type WorkflowAction } from './workflow-actions.types';

export default function WorkflowActions() {
  const params = useParams<WorkflowPageParams>();
  const workflowDetailsParams = pick(
    params,
    'cluster',
    'workflowId',
    'runId',
    'domain'
  );

  const {
    data: workflow,
    isLoading: isWorkflowLoading,
    error: workflowError,
  } = useDescribeWorkflow({
    ...workflowDetailsParams,
  });

  const { data: actionsEnabledConfig, isLoading: isActionsEnabledLoading } =
    useConfigValue('WORKFLOW_ACTIONS_ENABLED', {
      domain: params.domain,
      cluster: params.cluster,
    });

  const [selectedAction, setSelectedAction] = useState<
    WorkflowAction<any, any, any> | undefined
  >(undefined);

  if (workflowError) {
    return null;
  }

  return (
    <>
      <StatefulPopover
        placement={POPOVER_PLACEMENT.bottomRight}
        overrides={overrides.popover}
        content={({ close }) => (
          <WorkflowActionsMenu
            workflow={workflow}
            actionsEnabledConfig={actionsEnabledConfig}
            onActionSelect={(action) => {
              setSelectedAction(action);
              close();
            }}
          />
        )}
        returnFocus
        autoFocus
      >
        <Button
          size="compact"
          kind="secondary"
          endEnhancer={<MdArrowDropDown size={20} />}
          loadingIndicatorType="skeleton"
          isLoading={isWorkflowLoading || isActionsEnabledLoading}
        >
          Workflow Actions
        </Button>
      </StatefulPopover>
      <WorkflowActionsModal
        {...workflowDetailsParams}
        action={selectedAction}
        onClose={() => setSelectedAction(undefined)}
      />
    </>
  );
}
