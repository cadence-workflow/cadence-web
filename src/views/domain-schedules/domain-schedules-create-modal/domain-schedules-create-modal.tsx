'use client';

import React, { useEffect, useRef } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Banner, HIERARCHY, KIND as BANNER_KIND } from 'baseui/banner';
import { Modal, ModalButton } from 'baseui/modal';
import { useSnackbar } from 'baseui/snackbar';
import { useForm } from 'react-hook-form';
import { MdCheckCircle, MdErrorOutline } from 'react-icons/md';

import useCreateSchedule from '@/views/shared/hooks/use-create-schedule/use-create-schedule';

import DomainSchedulesCreateForm from '../domain-schedules-create-form/domain-schedules-create-form';
import DomainSchedulesCreateSuccessMsg from '../domain-schedules-create-success-msg/domain-schedules-create-success-msg';

import { overrides, styled } from './domain-schedules-create-modal.styles';
import {
  type DomainSchedulesCreateFormData,
  type Props,
} from './domain-schedules-create-modal.types';
import transformDomainSchedulesCreateFormToBody from './helpers/transform-domain-schedules-create-form-to-body';
import { createScheduleFormSchema } from './schemas/create-schedule-form-schema';

export default function DomainSchedulesCreateModal({
  domain,
  cluster,
  isOpen,
  onClose,
}: Props) {
  const { enqueue, dequeue } = useSnackbar();
  const {
    mutate: createSchedule,
    isPending: isCreateSchedulePending,
    reset: resetCreateScheduleMutation,
    error: createScheduleError,
  } = useCreateSchedule({ domain, cluster });

  const errorAlertRef = useRef<HTMLDivElement>(null);

  const { control, handleSubmit, reset, clearErrors, trigger } =
    useForm<DomainSchedulesCreateFormData>({
      resolver: zodResolver(createScheduleFormSchema),
      mode: 'onSubmit',
      reValidateMode: 'onChange',
    });

  useEffect(() => {
    if (!isOpen) return;
    reset();
    resetCreateScheduleMutation();
    clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (createScheduleError) {
      errorAlertRef.current?.scrollIntoView({ block: 'start' });
    }
  }, [createScheduleError]);

  const onSubmit = (data: DomainSchedulesCreateFormData) => {
    clearErrors();
    resetCreateScheduleMutation();
    createSchedule(transformDomainSchedulesCreateFormToBody(data), {
      onSuccess: (result) => {
        enqueue({
          message: (
            <DomainSchedulesCreateSuccessMsg
              domain={domain}
              cluster={cluster}
              scheduleId={result.scheduleId}
              onDismissMessage={() => dequeue()}
            />
          ),
          startEnhancer: MdCheckCircle,
          actionMessage: 'OK',
          actionOnClick: () => dequeue(),
        });
        onClose();
      },
    });
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
          {createScheduleError && (
            <div ref={errorAlertRef} role="alert">
              <Banner
                hierarchy={HIERARCHY.low}
                kind={BANNER_KIND.negative}
                overrides={overrides.banner}
                artwork={{
                  icon: MdErrorOutline,
                }}
              >
                {createScheduleError.message.trim() ||
                  'Failed to create schedule'}
              </Banner>
            </div>
          )}
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
          <ModalButton
            size="compact"
            kind="primary"
            type="submit"
            isLoading={isCreateSchedulePending}
            disabled={isCreateSchedulePending}
          >
            Create schedule
          </ModalButton>
        </styled.ModalFooter>
      </form>
    </Modal>
  );
}
