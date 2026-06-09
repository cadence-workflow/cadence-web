'use client';

import React, { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Banner, HIERARCHY, KIND as BANNER_KIND } from 'baseui/banner';
import { Modal, ModalButton } from 'baseui/modal';
import { useForm } from 'react-hook-form';
import { MdErrorOutline } from 'react-icons/md';

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
  const [serverBannerMessage, setServerBannerMessage] = useState<string | null>(
    null
  );

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
    setServerBannerMessage(null);
    clearErrors();
    // Intentionally depend only on isOpen so typing does not re-trigger a full form reset
    // when RHF/TanStack callback identities change between renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const onSubmit = (data: CreateScheduleFormData) => {
    setServerBannerMessage(null);
    clearErrors();
  };

  const modalErrorBannerMessage = serverBannerMessage;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeable
      overrides={overrides.modal}
    >
      <styled.ModalHeader tabIndex={0}>Create Schedule</styled.ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <styled.ModalBody>
          {modalErrorBannerMessage && (
            <Banner
              hierarchy={HIERARCHY.low}
              kind={BANNER_KIND.negative}
              overrides={overrides.banner}
              artwork={{
                icon: MdErrorOutline,
              }}
            >
              {modalErrorBannerMessage}
            </Banner>
          )}
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
