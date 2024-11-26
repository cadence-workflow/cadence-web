'use client';
import React, { useState } from 'react';

import { Button } from 'baseui/button';
import { MdOutlineTerminal } from 'react-icons/md';

import WorkflowPageCliCommandsModal from '../workflow-page-cli-commands-modal/workflow-page-cli-commands-modal';

export default function WorkflowPageCliCommandsButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        size="compact"
        kind="tertiary"
        startEnhancer={<MdOutlineTerminal size={20} />}
        onClick={() => setIsOpen((v) => !v)}
      >
        CLI commands
      </Button>
      <WorkflowPageCliCommandsModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </>
  );
}
