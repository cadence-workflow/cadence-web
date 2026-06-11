'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, ModalButton } from 'baseui/modal';
import { type FieldValues, useForm } from 'react-hook-form';
import { MdList, MdOpenInNew } from 'react-icons/md';

import { type SignalWorkflowSubmissionData } from '@/views/workflow-actions/workflow-action-signal-form/workflow-action-signal-form.types';

import DomainBatchActionsBanner from '../domain-batch-actions-banner/domain-batch-actions-banner';
import {
  type BatchActionConfirmPayload,
  type BatchActionModalConfig,
} from '../domain-batch-actions.types';

import {
  overrides,
  styled,
} from './domain-batch-actions-confirmation-modal.styles';
import { type Props } from './domain-batch-actions-confirmation-modal.types';

export default function DomainBatchActionsConfirmationModal({
  config: modalConfig,
  actionId,
  selectedCount,
  isSubmitting,
  onClose,
  onConfirm,
}: Props) {
  const config: BatchActionModalConfig<any, any> | null =
    (actionId ? modalConfig[actionId] : null) ?? null;

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver:
      config && config.withForm ? zodResolver(config.formSchema) : undefined,
  });

  const onSubmit = (data: FieldValues) => {
    if (!actionId || !config) return;
    const payload: BatchActionConfirmPayload<
      SignalWorkflowSubmissionData | undefined
    > = {
      actionId,
      submissionData: config.transformFormDataToSubmission?.(data),
    };
    onConfirm(payload);
  };

  return (
    <Modal
      isOpen={Boolean(actionId && config)}
      onClose={onClose}
      closeable
      overrides={overrides.modal}
    >
      {config && (
        <form onSubmit={handleSubmit(onSubmit)}>
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
              onActionClick={onClose}
            >
              <styled.SelectionText>
                {selectedCount} workflows selected
              </styled.SelectionText>
            </DomainBatchActionsBanner>
            {config.withForm && (
              <config.form control={control} fieldErrors={errors} />
            )}
          </styled.ModalBody>
          <styled.ModalFooter>
            <ModalButton
              size="compact"
              type="button"
              kind="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Close
            </ModalButton>
            <ModalButton
              size="compact"
              kind="primary"
              type="submit"
              isLoading={isSubmitting}
              disabled={Object.keys(errors).length > 0 || isSubmitting}
            >
              Start Batch Action
            </ModalButton>
          </styled.ModalFooter>
        </form>
      )}
    </Modal>
  );
}
