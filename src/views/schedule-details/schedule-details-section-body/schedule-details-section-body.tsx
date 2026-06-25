'use client';
import React from 'react';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import ScheduleDetailsTable from '../schedule-details-table/schedule-details-table';

import { cssStyles } from './schedule-details-section-body.styles';
import { type Props } from './schedule-details-section-body.types';

export default function ScheduleDetailsSectionBody({ title, rows }: Props) {
  const { cls } = useStyletronClasses(cssStyles);

  return (
    <div className={cls.bodyContainer}>
      <ScheduleDetailsTable rows={rows} ariaLabel={`${title} details`} />
    </div>
  );
}
