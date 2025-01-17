'use client';
import React, { useState } from 'react';

import { Button, KIND, SIZE } from 'baseui/button';
import {
  StatefulPopover,
  PLACEMENT as POPOVER_PLACEMENT,
} from 'baseui/popover';
import {
  SnackbarProvider,
  PLACEMENT as SNACKBAR_PLACEMENT,
  DURATION,
} from 'baseui/snackbar';
import { pick } from 'lodash';
import { useParams } from 'next/navigation';
import { MdArrowDropDown } from 'react-icons/md';

import useDescribeWorkflow from '@/views/workflow-page/hooks/use-describe-workflow';
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

  const { data: workflow } = useDescribeWorkflow({
    ...workflowDetailsParams,
  });

  const [selectedAction, setSelectedAction] = useState<
    WorkflowAction<unknown> | undefined
  >(undefined);

  return (
    <SnackbarProvider
      placement={SNACKBAR_PLACEMENT.bottom}
      overrides={overrides.snackbar}
      defaultDuration={DURATION.infinite}
    >
      <StatefulPopover
        placement={POPOVER_PLACEMENT.bottomRight}
        overrides={overrides.popover}
        content={() => (
          <WorkflowActionsMenu
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
      <WorkflowActionsModal
        {...workflowDetailsParams}
        action={selectedAction}
        onClose={() => setSelectedAction(undefined)}
      />
    </SnackbarProvider>
  );
}
