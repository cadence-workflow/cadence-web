import { Modal } from 'baseui/modal';

import WorkflowActionsModalContent from '../workflow-actions-modal-content/workflow-actions-modal-content';

import { overrides } from './workflow-actions-modal.styles';
import { type Props } from './workflow-actions-modal.types';

export default function WorkflowActionsModal<R>({
  action,
  onClose,
  ...workflowDetailsParams
}: Props<R>) {
  return (
    <Modal
      isOpen={Boolean(action)}
      onClose={onClose}
      closeable
      overrides={overrides.modal}
    >
      {action && (
        <WorkflowActionsModalContent
          action={action}
          params={{
            ...workflowDetailsParams,
          }}
          onCloseModal={onClose}
        />
      )}
    </Modal>
  );
}
