'use client';
import React from 'react';

import PageSection from '@/components/page-section/page-section';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import useDescribeSchedule from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule';

import { type Props } from './schedule-details.types';

export default function ScheduleDetails({ params }: Props) {
  const { data, isLoading, isPending } = useDescribeSchedule({
    domain: params.domain,
    cluster: params.cluster,
    scheduleId: params.scheduleId,
    throwOnError: true,
  });

  if (isLoading || isPending) {
    return <SectionLoadingIndicator />;
  }
  // Should never happen as we have throwOnError set to true but it is for better type safety below
  if (!data) {
    throw new Error('Schedule data is unavailable');
  }

  return (
    <PageSection>
      <div>Details — coming soon</div>
    </PageSection>
  );
}
