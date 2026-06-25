'use client';
import React from 'react';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import ScheduleDetailsSectionBody from '../schedule-details-section-body/schedule-details-section-body';
import ScheduleDetailsSectionHeader from '../schedule-details-section-header/schedule-details-section-header';

import { cssStyles } from './schedule-details-section.styles';
import { type Props } from './schedule-details-section.types';

export default function ScheduleDetailsSection({
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
      <ScheduleDetailsSectionHeader
        title={title}
        isCollapsed={isCollapsed}
        onToggle={onToggle}
      />
      {!isCollapsed && (
        <ScheduleDetailsSectionBody title={title} rows={rows} />
      )}
    </section>
  );
}
