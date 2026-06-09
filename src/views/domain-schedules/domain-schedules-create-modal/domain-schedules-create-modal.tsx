'use client';

import React, { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Banner, HIERARCHY, KIND as BANNER_KIND } from 'baseui/banner';
import { Modal, ModalButton } from 'baseui/modal';
import { useSnackbar } from 'baseui/snackbar';
import { useForm, useWatch } from 'react-hook-form';
import { MdCheckCircle, MdErrorOutline } from 'react-icons/md';

import { SCHEDULE_CATCH_UP_POLICIES } from '@/route-handlers/create-schedule/create-schedule.constants';
import { RequestError } from '@/utils/request/request-error';
import useCreateSchedule from '@/views/shared/hooks/use-create-schedule/use-create-schedule';

import CreateScheduleForm from './create-schedule-form/create-schedule-form';
import { type CreateScheduleFormData } from './create-schedule-form/create-schedule-form.types';
import { overrides, styled } from './domain-schedules-create-modal.styles';
import { type Props } from './domain-schedules-create-modal.types';
import getCreateScheduleFormDefaultValues from './helpers/get-create-schedule-form-default-values';
import mapServerValidationIssuesToCreateScheduleForm from './helpers/map-server-validation-issues-to-create-schedule-form';
import transformCreateScheduleFormToBody from './helpers/transform-create-schedule-form-to-body';
import { createScheduleFormSchema } from './schemas/create-schedule-form-schema';

export default function DomainSchedulesCreateModal({
  domain,
  cluster,
  isOpen,
  onClose,
}: Props) {
  const { enqueue, dequeue } = useSnackbar();
  const {
    mutateAsync: createScheduleAsync,
    isPending: isCreateSchedulePending,
    reset: resetCreateScheduleMutation,
  } = useCreateSchedule({ domain, cluster });
  const [serverBannerMessage, setServerBannerMessage] = useState<string | null>(
    null
  );

  const {
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors: validationErrors },
  } = useForm<CreateScheduleFormData>({
    resolver: zodResolver(createScheduleFormSchema),
    defaultValues: getCreateScheduleFormDefaultValues(),
    mode: 'onSubmit',
  });

  const catchUpPolicy = useWatch({
    control,
    name: 'catchUpPolicy',
    defaultValue: SCHEDULE_CATCH_UP_POLICIES[0],
  });

  useEffect(() => {
    if (!isOpen) return;
    reset(getCreateScheduleFormDefaultValues());
    resetCreateScheduleMutation();
    setServerBannerMessage(null);
    clearErrors();
    // Intentionally depend only on isOpen so typing does not re-trigger a full form reset
    // when RHF/TanStack callback identities change between renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const onSubmit = async (data: CreateScheduleFormData) => {
    setServerBannerMessage(null);
    clearErrors();

    try {
      await createScheduleAsync(transformCreateScheduleFormToBody(data));
      enqueue({
        message: 'Schedule created',
        startEnhancer: MdCheckCircle,
        actionMessage: 'OK',
        actionOnClick: () => dequeue(),
      });
      onClose();
    } catch (error) {
      if (
        error instanceof RequestError &&
        error.status === 400 &&
        error.validationErrors?.length
      ) {
        const { unmappedMessages } =
          mapServerValidationIssuesToCreateScheduleForm(
            error.validationErrors,
            setError
          );
        resetCreateScheduleMutation();
        setServerBannerMessage(
          unmappedMessages.length ? unmappedMessages.join(' ') : null
        );
        return;
      }
      if (error instanceof RequestError) {
        setServerBannerMessage(error.message);
      }
    }
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
          {serverBannerMessage && (
            <Banner
              hierarchy={HIERARCHY.low}
              kind={BANNER_KIND.negative}
              overrides={overrides.banner}
              artwork={{
                icon: MdErrorOutline,
              }}
            >
              {serverBannerMessage}
            </Banner>
          )}
          <CreateScheduleForm
            control={control}
            fieldErrors={validationErrors}
            catchUpPolicy={catchUpPolicy}
          />
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
