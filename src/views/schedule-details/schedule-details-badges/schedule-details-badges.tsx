'use client';
import React from 'react';

import { Badge } from 'baseui/badge';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import { cssStyles, overrides } from './schedule-details-badges.styles';
import { type Props } from './schedule-details-badges.types';

export default function ScheduleDetailsBadges({ labels }: Props) {
  const { cls } = useStyletronClasses(cssStyles);

  if (labels.length === 0) {
    return null;
  }

  return (
    <div className={cls.container}>
      {labels.map((label, index) => (
        <Badge
          key={`${label}-${index}`}
          content={label}
          shape="rectangle"
          color="primary"
          overrides={overrides.badge}
        />
      ))}
    </div>
  );
}
