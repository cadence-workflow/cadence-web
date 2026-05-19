'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { KIND as BUTTON_KIND, SIZE } from 'baseui/button';
import { Modal, ModalButton } from 'baseui/modal';
import { useForm } from 'react-hook-form';
import { MdList, MdOpenInNew } from 'react-icons/md';

import { signalWorkflowFormSchema } from '@/views/workflow-actions/workflow-action-signal-form/schemas/signal-workflow-form-schema';
import WorkflowActionSignalForm from '@/views/workflow-actions/workflow-action-signal-form/workflow-action-signal-form';
import { type SignalWorkflowFormData } from '@/views/workflow-actions/workflow-action-signal-form/workflow-action-signal-form.types';

import domainBatchActionsConfirmationModalConfig from '../config/domain-batch-actions-confirmation-modal.config';
import DomainBatchActionsBanner from '../domain-batch-actions-banner/domain-batch-actions-banner';

import {
  overrides,
  styled,
} from './domain-batch-actions-confirmation-modal.styles';
import { type Props } from './domain-batch-actions-confirmation-modal.types';

export default function DomainBatchActionsConfirmationModal({
  actionId,
  selectedCount,
  isSubmitting,
  onClose,
  onConfirm,
}: Props) {
  const config = actionId
    ? domainBatchActionsConfirmationModalConfig[actionId] ?? null
    : null;

  const {
    handleSubmit,
    formState: { errors: validationErrors },
    control,
    watch,
    clearErrors,
    trigger,
    reset,
  } = useForm<SignalWorkflowFormData>({
    resolver: zodResolver(signalWorkflowFormSchema),
    defaultValues: { signalName: '', signalInput: '' },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleConfirm = () => {
    if (!actionId) return;

    if (config?.withForm) {
      handleSubmit((data: SignalWorkflowFormData) => {
        onConfirm(actionId, data);
        reset();
      })();
    } else {
      onConfirm(actionId);
    }
  };

  return (
    <Modal
      isOpen={Boolean(actionId && config)}
      onClose={handleClose}
      closeable
      overrides={overrides.modal}
    >
      {config && (
        <>
          <styled.ModalHeader>{config.title}</styled.ModalHeader>
          <styled.ModalBody>
            <styled.Description>{config.description}</styled.Description>
            {config.docsLink && (
              <styled.Link
                href={config.docsLink.href}
                target="_blank"
                rel="noreferrer"
              >
                {config.docsLink.text}
                <MdOpenInNew />
              </styled.Link>
            )}
            <DomainBatchActionsBanner
              icon={<MdList />}
              actionLabel="Change"
              onActionClick={handleClose}
            >
              <styled.SelectionText>
                {selectedCount} workflows selected
              </styled.SelectionText>
            </DomainBatchActionsBanner>
            {config.withForm && (
              // TODO: WorkflowActionSignalForm requires cluster/domain/workflowId/runId
              // but doesn't use them. Narrow the form's prop interface for batch usage.
              <WorkflowActionSignalForm
                formData={watch()}
                fieldErrors={validationErrors}
                control={control}
                clearErrors={clearErrors}
                trigger={trigger}
                cluster=""
                domain=""
                workflowId=""
                runId=""
              />
            )}
          </styled.ModalBody>
          <styled.ModalFooter>
            <ModalButton
              size={SIZE.compact}
              type="button"
              kind={BUTTON_KIND.secondary}
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Close
            </ModalButton>
            <ModalButton
              size={SIZE.compact}
              kind={BUTTON_KIND.primary}
              type="button"
              onClick={handleConfirm}
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Start Batch Action
            </ModalButton>
          </styled.ModalFooter>
        </>
      )}
    </Modal>
  );
}
