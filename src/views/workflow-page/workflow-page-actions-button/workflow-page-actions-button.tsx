'use client';
import React from 'react';

import { Button } from 'baseui/button';
import { StatefulPopover } from 'baseui/popover';
import { MdArrowDropDown } from 'react-icons/md';

import WorkflowPageActionsMenu from '../workflow-page-actions-menu/workflow-page-actions-menu';

export default function WorkflowPageActionsButton() {
  return (
    <StatefulPopover
      content={() => <WorkflowPageActionsMenu />}
      returnFocus
      autoFocus
    >
      <Button
        size="compact"
        kind="tertiary"
        endEnhancer={<MdArrowDropDown size={20} />}
      >
        Actions
      </Button>
      {/* <WorkflowPageActionsModal /> */}
    </StatefulPopover>
  );
}
