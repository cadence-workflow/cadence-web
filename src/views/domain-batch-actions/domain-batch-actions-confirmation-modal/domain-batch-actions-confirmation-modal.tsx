'use client';
import { SIZE } from 'baseui/button';
import { Modal, ModalButton } from 'baseui/modal';
import { type FieldValues } from 'react-hook-form';
import { MdList, MdOpenInNew } from 'react-icons/md';

import domainBatchActionsConfirmationModalConfig from '../config/domain-batch-actions-confirmation-modal.config';
import DomainBatchActionsBanner from '../domain-batch-actions-banner/domain-batch-actions-banner';

import {
  overrides,
  styled,
} from './domain-batch-actions-confirmation-modal.styles';
import { type Props } from './domain-batch-actions-confirmation-modal.types';

const BATCH_ACTION_FORM_ID = 'batch-action-form';

export default function DomainBatchActionsConfirmationModal({
  actionId,
  selectedCount,
  onClose,
  onConfirm,
}: Props) {
  const config = actionId
    ? domainBatchActionsConfirmationModalConfig[actionId]
    : null;

  const handleConfirm = () => {
    if (!actionId) return;
    onConfirm(actionId);
  };

  const handleFormSubmit = (data: FieldValues) => {
    if (!actionId) return;
    onConfirm(actionId, data);
  };

  return (
    <Modal
      isOpen={Boolean(actionId && config)}
      onClose={onClose}
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
              onActionClick={onClose}
            >
              <styled.SelectionText>
                {selectedCount} workflows selected
              </styled.SelectionText>
            </DomainBatchActionsBanner>
            {config.withForm && (
              <config.FormComponent
                formId={BATCH_ACTION_FORM_ID}
                onSubmit={handleFormSubmit}
              />
            )}
          </styled.ModalBody>
          <styled.ModalFooter>
            <ModalButton
              size={SIZE.compact}
              type="button"
              kind="secondary"
              onClick={onClose}
            >
              Close
            </ModalButton>
            {config.withForm ? (
              <ModalButton
                size={SIZE.compact}
                kind="primary"
                type="submit"
                form={BATCH_ACTION_FORM_ID}
              >
                Start Batch Action
              </ModalButton>
            ) : (
              <ModalButton
                size={SIZE.compact}
                kind="primary"
                type="button"
                onClick={handleConfirm}
              >
                Start Batch Action
              </ModalButton>
            )}
          </styled.ModalFooter>
        </>
      )}
    </Modal>
  );
}
