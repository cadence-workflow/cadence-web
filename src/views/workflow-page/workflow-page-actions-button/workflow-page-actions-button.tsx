'use client';
import React from 'react';

import { Button, KIND, SIZE } from 'baseui/button';
import { PLACEMENT, StatefulPopover } from 'baseui/popover';
import { pick } from 'lodash';
import { useParams } from 'next/navigation';
import { MdArrowDropDown } from 'react-icons/md';

import useDescribeWorkflow from '../hooks/use-describe-workflow';
import WorkflowPageActionsMenu from '../workflow-page-actions-menu/workflow-page-actions-menu';
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

  const {
    data: workflow,
    isLoading,
    isError,
  } = useDescribeWorkflow({
    ...workflowDetailsParams,
  });

  return (
    <StatefulPopover
      placement={PLACEMENT.bottomRight}
      overrides={overrides.popover}
      content={() => (
        <WorkflowPageActionsMenu
          workflow={workflow}
          isLoading={isLoading}
          disableAll={isError}
          onMenuItemSelect={() => {}}
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
      {/* <WorkflowPageActionsModal /> */}
    </StatefulPopover>
  );
}
