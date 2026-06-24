'use client';
import React from 'react';

import ReadOnlyDetailsTable from '@/components/read-only-details-table/read-only-details-table';
import useStyletronClasses from '@/hooks/use-styletron-classes';

import { cssStyles } from './schedule-page-details-section-body.styles';
import { type Props } from './schedule-page-details-section-body.types';

export default function SchedulePageDetailsSectionBody({ title, rows }: Props) {
  const { cls } = useStyletronClasses(cssStyles);

  return (
    <div className={cls.bodyContainer}>
      <ReadOnlyDetailsTable rows={rows} ariaLabel={`${title} details`} />
    </div>
  );
}
