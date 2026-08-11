'use client';
import React from 'react';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import { cssStyles } from './workflow-history-event-details-placeholder-text.styles';
import type { Props } from './workflow-history-event-details-placeholder-text.types';

export default function WorkflowHistoryEventDetailsPlaceholderText({
  placeholderText = 'Not set',
}: Props) {
  const { cls } = useStyletronClasses(cssStyles);
  return <div className={cls.placeholderText}>{placeholderText}</div>;
}
