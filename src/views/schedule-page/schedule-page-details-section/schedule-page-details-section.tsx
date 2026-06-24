'use client';
import React from 'react';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import SchedulePageDetailsSectionBody from '../schedule-page-details-section-body/schedule-page-details-section-body';
import SchedulePageDetailsSectionHeader from '../schedule-page-details-section-header/schedule-page-details-section-header';

import { cssStyles } from './schedule-page-details-section.styles';
import { type Props } from './schedule-page-details-section.types';

export default function SchedulePageDetailsSection({
  title,
  rows,
  initiallyCollapsed = false,
}: Props) {
  const { cls } = useStyletronClasses(cssStyles);
  const [isCollapsed, setIsCollapsed] = React.useState(initiallyCollapsed);

  const onToggle = React.useCallback(() => {
    setIsCollapsed((currentValue) => !currentValue);
  }, []);

  return (
    <section className={cls.section}>
      <SchedulePageDetailsSectionHeader
        title={title}
        isCollapsed={isCollapsed}
        onToggle={onToggle}
      />
      {!isCollapsed && <SchedulePageDetailsSectionBody title={title} rows={rows} />}
    </section>
  );
}
