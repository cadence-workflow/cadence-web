'use client';
import React from 'react';

import { Badge } from 'baseui/badge';
import { MdPause } from 'react-icons/md';

import { styled } from './schedule-status-tag.styles';
import type { Props } from './schedule-status-tag.types';

export default function ScheduleStatusTag({ paused }: Props) {
  const Icon = paused ? MdPause : styled.RunningSpinner;
  const label = paused ? 'Paused' : 'Running';
  const color = paused ? 'warning' : 'accent';

  return (
    <Badge
      hierarchy="primary"
      color={color}
      content={
        <styled.BadgeContent>
          <Icon size={14} />
          {label}
        </styled.BadgeContent>
      }
    />
  );
}
