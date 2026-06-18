'use client';
import React from 'react';

import ReadOnlyDetailsTable from '@/components/read-only-details-table/read-only-details-table';
import useStyletronClasses from '@/hooks/use-styletron-classes';

import { cssStyles } from './schedule-page-details-section.styles';
import { type Props } from './schedule-page-details-section.types';

export default function SchedulePageDetailsSection({ title, rows }: Props) {
  const { cls } = useStyletronClasses(cssStyles);

  return (
    <section className={cls.section}>
      <h2 className={cls.title}>{title}</h2>
      <ReadOnlyDetailsTable rows={rows} ariaLabel={`${title} details`} />
    </section>
  );
}
