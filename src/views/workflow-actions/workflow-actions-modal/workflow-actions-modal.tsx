import { KIND, SIZE } from 'baseui/button';
import { Modal, ModalButton } from 'baseui/modal';

import { type DescribeWorkflowResponse } from '@/route-handlers/describe-workflow/describe-workflow.types';

import { type WorkflowAction } from '../workflow-actions.types';

import { overrides, styled } from './workflow-actions-modal.styles';

export default function WorkflowActionsModal({
  // workflow,
  action,
  onClose,
}: {
  workflow: DescribeWorkflowResponse;
  action: WorkflowAction | undefined;
  onClose: () => void;
}) {
  return (
    <Modal
      isOpen={Boolean(action)}
      onClose={onClose}
      closeable
      overrides={overrides.modal}
    >
      {action && (
        <>
          <styled.ModalHeader>{action.label} workflow</styled.ModalHeader>
          <styled.ModalBody>{action.subtitle}</styled.ModalBody>
          <styled.ModalFooter>
            <ModalButton
              size={SIZE.compact}
              kind={KIND.secondary}
              onClick={onClose}
            >
              Go back
            </ModalButton>
            <ModalButton
              size={SIZE.compact}
              kind={KIND.primary}
              onClick={() => {
                // perform the action here
              }}
            >
              {action.label} workflow
            </ModalButton>
          </styled.ModalFooter>
        </>
      )}
    </Modal>
  );
}
