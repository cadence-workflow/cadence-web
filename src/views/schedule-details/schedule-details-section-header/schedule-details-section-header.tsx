'use client';
import React from 'react';

import ChevronDown from 'baseui/icon/chevron-down';
import ChevronUp from 'baseui/icon/chevron-up';

import Button from '@/components/button/button';

import { overrides, styled } from './schedule-details-section-header.styles';
import { type Props } from './schedule-details-section-header.types';

export default function ScheduleDetailsSectionHeader({
  title,
  isCollapsed,
  onToggle,
}: Props) {
  const buttonActionLabel = isCollapsed ? 'Expand' : 'Collapse';
  const CollapseIcon = isCollapsed ? ChevronDown : ChevronUp;

  return (
    <styled.HeaderContainer>
      <styled.Title>{title}</styled.Title>
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
    </styled.HeaderContainer>
  );
}
