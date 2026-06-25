'use client';
import React from 'react';

import ChevronDown from 'baseui/icon/chevron-down';
import ChevronUp from 'baseui/icon/chevron-up';

import Button from '@/components/button/button';
import useStyletronClasses from '@/hooks/use-styletron-classes';

import { cssStyles, overrides } from './schedule-details-section-header.styles';
import { type Props } from './schedule-details-section-header.types';

export default function ScheduleDetailsSectionHeader({
  title,
  isCollapsed,
  onToggle,
}: Props) {
  const { cls } = useStyletronClasses(cssStyles);
  const buttonActionLabel = isCollapsed ? 'Expand' : 'Collapse';
  const CollapseIcon = isCollapsed ? ChevronDown : ChevronUp;

  return (
    <div className={cls.headerContainer}>
      <h2 className={cls.title}>{title}</h2>
      <Button
        size="compact"
        kind="secondary"
        onClick={onToggle}
        aria-label={`${buttonActionLabel} ${title} details`}
        aria-expanded={!isCollapsed}
        overrides={overrides.collapseButton}
      >
        <CollapseIcon size={16} />
      </Button>
    </div>
  );
}
