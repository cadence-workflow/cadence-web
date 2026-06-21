'use client';
import React from 'react';

import useDescribeSchedule from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule';
import ScheduleStatusTag from '@/views/shared/schedule-status-tag/schedule-status-tag';

import type { Props } from './schedule-page-header-status-tag.types';

export default function SchedulePageHeaderStatusTag(props: Props) {
  const { data: scheduleDetails, isLoading } = useDescribeSchedule(props);

  if (isLoading || !scheduleDetails) {
    return null;
  }

  return <ScheduleStatusTag paused={scheduleDetails.state?.paused ?? false} />;
}
