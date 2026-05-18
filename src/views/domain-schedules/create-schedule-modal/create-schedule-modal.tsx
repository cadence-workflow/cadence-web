'use client';

import React from 'react';

import { KIND as BUTTON_KIND, SIZE } from 'baseui/button';
import { Modal, ModalButton } from 'baseui/modal';
import { ParagraphMedium } from 'baseui/typography';

import { overrides, styled } from './create-schedule-modal.styles';
import { type Props } from './create-schedule-modal.types';

export default function CreateScheduleModal({
  domain: _domain,
  cluster: _cluster,
  isOpen,
  onClose,
}: Props) {
  void _domain;
  void _cluster;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeable
      overrides={overrides.modal}
    >
      <styled.ModalHeader>Create Schedule</styled.ModalHeader>
      <styled.ModalBody>
        <ParagraphMedium marginTop="scale0" marginBottom="scale0">
          Schedule form will be added in the next change. This dialog confirms
          entry points and layout only.
        </ParagraphMedium>
      </styled.ModalBody>
      <styled.ModalFooter>
        <ModalButton
          size={SIZE.compact}
          type="button"
          kind={BUTTON_KIND.secondary}
          onClick={onClose}
        >
          Cancel
        </ModalButton>
        <ModalButton
          size={SIZE.compact}
          kind={BUTTON_KIND.primary}
          type="button"
          disabled
        >
          Create schedule
        </ModalButton>
      </styled.ModalFooter>
    </Modal>
  );
}
