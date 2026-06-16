'use client';

import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, ModalButton } from 'baseui/modal';
import { useForm } from 'react-hook-form';

import DomainSchedulesCreateForm from '../domain-schedules-create-form/domain-schedules-create-form';

import { overrides, styled } from './domain-schedules-create-modal.styles';
import {
  type DomainSchedulesCreateFormData,
  type Props,
} from './domain-schedules-create-modal.types';
import { createScheduleFormSchema } from './schemas/create-schedule-form-schema';

export default function DomainSchedulesCreateModal({ isOpen, onClose }: Props) {
  const { control, handleSubmit, reset, clearErrors, trigger } =
    useForm<DomainSchedulesCreateFormData>({
      resolver: zodResolver(createScheduleFormSchema),
      defaultValues: {},
      mode: 'onSubmit',
      reValidateMode: 'onChange',
    });

  useEffect(() => {
    if (!isOpen) return;
    reset();
    clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const onSubmit = (_data: DomainSchedulesCreateFormData) => {
    clearErrors();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeable
      overrides={overrides.modal}
    >
      <styled.ModalHeader>Create Schedule</styled.ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <styled.ModalBody>
          <DomainSchedulesCreateForm control={control} trigger={trigger} />
        </styled.ModalBody>
        <styled.ModalFooter>
          <ModalButton
            size="compact"
            type="button"
            kind="secondary"
            onClick={onClose}
          >
            Cancel
          </ModalButton>
          <ModalButton size="compact" kind="primary" type="submit">
            Create schedule
          </ModalButton>
        </styled.ModalFooter>
      </form>
    </Modal>
  );
}
