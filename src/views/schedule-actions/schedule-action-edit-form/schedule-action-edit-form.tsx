'use client';

import React from 'react';

import DomainSchedulesCreateForm from '@/views/domain-schedules/domain-schedules-create-form/domain-schedules-create-form';

import { type Props } from './schedule-action-edit-form.types';

export default function ScheduleActionEditForm({
  control,
  trigger,
  clearErrors,
  domain,
  cluster,
}: Props) {
  return (
    <DomainSchedulesCreateForm
      control={control}
      trigger={trigger}
      clearErrors={clearErrors}
      domain={domain}
      cluster={cluster}
      scheduleIdReadOnly
    />
  );
}
