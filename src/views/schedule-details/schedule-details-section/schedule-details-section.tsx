'use client';
import React, { useState, useCallback } from 'react';

import ScheduleDetailsSectionHeader from '../schedule-details-section-header/schedule-details-section-header';
import ScheduleDetailsTable from '../schedule-details-table/schedule-details-table';

import { styled } from './schedule-details-section.styles';
import { type Props } from './schedule-details-section.types';

export default function ScheduleDetailsSection({
  title,
  rows,
  initiallyCollapsed = false,
}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(initiallyCollapsed);

  const onToggle = useCallback(() => {
    setIsCollapsed((currentValue) => !currentValue);
  }, []);

  return (
    <styled.Section>
      <ScheduleDetailsSectionHeader
        title={title}
        isCollapsed={isCollapsed}
        onToggle={onToggle}
      />
      {!isCollapsed && (
        <ScheduleDetailsTable rows={rows} ariaLabel={`${title} details`} />
      )}
    </styled.Section>
  );
}
