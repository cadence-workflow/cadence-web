'use client';
import React, { useState } from 'react';

import { Button, KIND, SIZE } from 'baseui/button';
import { PLACEMENT, StatefulPopover } from 'baseui/popover';
import { pick } from 'lodash';
import { useParams } from 'next/navigation';
import { MdArrowDropDown } from 'react-icons/md';

import useDescribeWorkflow from '../hooks/use-describe-workflow';
import WorkflowPageActionsMenu from '../workflow-page-actions-menu/workflow-page-actions-menu';
import { type WorkflowAction } from '../workflow-page-actions-menu/workflow-page-actions-menu.types';
import WorkflowPageActionsModal from '../workflow-page-actions-modal/workflow-page-actions-modal';
import { type WorkflowPageParams } from '../workflow-page.types';

import { overrides } from './workflow-page-actions-button.styles';

export default function WorkflowPageActionsButton() {
  const params = useParams<WorkflowPageParams>();
  const workflowDetailsParams = pick(
    params,
    'cluster',
    'workflowId',
    'runId',
    'domain'
  );

  const { data: workflow } = useDescribeWorkflow({
    ...workflowDetailsParams,
  });

  const [selectedAction, setSelectedAction] = useState<
    WorkflowAction | undefined
  >(undefined);

  return (
    <>
      <StatefulPopover
        placement={PLACEMENT.bottomRight}
        overrides={overrides.popover}
        content={() => (
          <WorkflowPageActionsMenu
            workflow={workflow}
            onActionSelect={(action) => setSelectedAction(action)}
          />
        )}
        returnFocus
        autoFocus
      >
        <Button
          size={SIZE.compact}
          kind={KIND.secondary}
          endEnhancer={<MdArrowDropDown size={20} />}
        >
          Workflow Actions
        </Button>
      </StatefulPopover>
      <WorkflowPageActionsModal
        workflow={workflow}
        action={selectedAction}
        onClose={() => setSelectedAction(undefined)}
      />
    </>
  );
}
