'use client';
import React, { useEffect, useRef } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { Modal, ModalButton } from 'baseui/modal';
import { Controller, useForm } from 'react-hook-form';

import LabelWithTooltip from '@/components/label-with-tooltip/label-with-tooltip';

import { BATCH_ACTION_RPS_DEFAULT } from '../domain-batch-actions.constants';

import {
  overrides,
  styled,
} from './domain-batch-actions-edit-rps-modal.styles';
import { type Props } from './domain-batch-actions-edit-rps-modal.types';
import {
  type EditRpsFormData,
  editRpsFormSchema,
} from './schemas/edit-rps-form-schema';

export default function DomainBatchActionsEditRpsModal({
  isOpen,
  currentRps,
  isSubmitting,
  onClose,
  onSubmit,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<EditRpsFormData>({
    mode: 'onChange',
    resolver: zodResolver(editRpsFormSchema),
    defaultValues: { rps: currentRps ?? BATCH_ACTION_RPS_DEFAULT },
  });

  // Reset the field to the current value only on the closed -> open transition,
  // so a cancelled edit does not leak into the next open, and a background
  // refetch of currentRps while open does not discard an in-progress edit.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (isOpen && !wasOpen.current) {
      reset({ rps: currentRps ?? BATCH_ACTION_RPS_DEFAULT });
    }
    wasOpen.current = isOpen;
  }, [isOpen, currentRps, reset]);

  const rpsValue = watch('rps');
  const isUnchanged = rpsValue === currentRps;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeable
      overrides={overrides.modal}
    >
      <form onSubmit={handleSubmit((data) => onSubmit(data.rps))}>
        <styled.ModalHeader>Edit RPS</styled.ModalHeader>
        <styled.ModalBody>
          <styled.Description>
            You can adjust Requests Per Second (RPS) for a batch action if
            needed. This provides flexibility to fine-tune performance based on
            system load, external dependencies, or operational constraints.
          </styled.Description>
          <FormControl
            label={
              <LabelWithTooltip
                label="RPS"
                tooltip="Requests per second limit for the batch operation"
              />
            }
            error={errors.rps?.message}
          >
            <Controller
              name="rps"
              control={control}
              render={({ field: { ref, value, onChange, ...field } }) => (
                <Input
                  {...field}
                  // @ts-expect-error - inputRef expects ref object while ref is a callback. It should support both.
                  inputRef={ref}
                  size="compact"
                  type="number"
                  // Show an empty field (not a forced "0") when cleared; NaN
                  // fails rpsSchema so Save stays disabled until a valid number.
                  value={Number.isNaN(value) ? '' : String(value)}
                  onChange={(e) => onChange(parseInt(e.target.value, 10))}
                  aria-label="RPS"
                  error={Boolean(errors.rps)}
                />
              )}
            />
          </FormControl>
        </styled.ModalBody>
        <styled.ModalFooter>
          <ModalButton
            size="compact"
            type="button"
            kind="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </ModalButton>
          <ModalButton
            size="compact"
            kind="primary"
            type="submit"
            isLoading={isSubmitting}
            disabled={!isValid || isUnchanged || isSubmitting}
          >
            Save RPS
          </ModalButton>
        </styled.ModalFooter>
      </form>
    </Modal>
  );
}
