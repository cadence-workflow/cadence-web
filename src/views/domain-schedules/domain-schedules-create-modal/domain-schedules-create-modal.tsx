'use client';

import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, ModalButton } from 'baseui/modal';
import { useForm } from 'react-hook-form';

import CreateScheduleForm from './create-schedule-form/create-schedule-form';
import { type CreateScheduleFormData } from './create-schedule-form/create-schedule-form.types';
import { overrides, styled } from './domain-schedules-create-modal.styles';
import { type Props } from './domain-schedules-create-modal.types';
import { createScheduleFormSchema } from './schemas/create-schedule-form-schema';

export default function DomainSchedulesCreateModal({
  domain: _domain,
  cluster: _cluster,
  isOpen,
  onClose,
}: Props) {
  const { control, handleSubmit, reset, clearErrors, trigger } =
    useForm<CreateScheduleFormData>({
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

  const onSubmit = (_data: CreateScheduleFormData) => {
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
          <CreateScheduleForm control={control} trigger={trigger} />
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
