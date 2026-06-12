'use client';
import React from 'react';

import ScheduleStatusTag from '@/views/shared/schedule-status-tag/schedule-status-tag';

import type { Props } from './schedule-page-header-status-tag.types';

//TODO @Assem-Hafez: Replace with live implementation in PR03b (useDescribeSchedule wiring).
export default function SchedulePageHeaderStatusTag(_props: Props) {
  return <ScheduleStatusTag paused={true} />;
}
