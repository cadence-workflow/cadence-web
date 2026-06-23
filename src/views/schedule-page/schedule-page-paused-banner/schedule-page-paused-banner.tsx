'use client';
import React from 'react';

import { Banner, HIERARCHY, KIND } from 'baseui/banner';
import { StyledLink } from 'baseui/link';
import { MdPause } from 'react-icons/md';

import PageSection from '@/components/page-section/page-section';
import useDescribeSchedule from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule';

import { formatScheduleTimestamp } from '../config/schedule-details-formatters';

import isEmailShapedActor from './helpers/is-email-shaped-actor';
import { overrides } from './schedule-page-paused-banner.styles';
import { type Props } from './schedule-page-paused-banner.types';

export default function SchedulePagePausedBanner(props: Props) {
  const { data: scheduleDetails, isLoading, isError } = useDescribeSchedule(props);

  if (isLoading || isError || !scheduleDetails?.state?.paused) {
    return null;
  }

  const pausedAt =
    formatScheduleTimestamp(scheduleDetails.state.pauseInfo?.pausedAt) ?? 'Unknown';
  const pausedBy = scheduleDetails.state.pauseInfo?.pausedBy?.trim() || 'Unknown';
  const reason = scheduleDetails.state.pauseInfo?.reason?.trim() || 'Unknown';

  return (
    <PageSection>
      <Banner
        hierarchy={HIERARCHY.low}
        kind={KIND.warning}
        title="This schedule is paused"
        artwork={{ icon: () => <MdPause size={20} aria-hidden /> }}
        overrides={overrides.banner}
      >
        Paused at: {pausedAt}. Paused by:{' '}
        {isEmailShapedActor(pausedBy) ? (
          <StyledLink href={`mailto:${pausedBy}`}>{pausedBy}</StyledLink>
        ) : (
          pausedBy
        )}
        . Reason: "{reason}".
      </Banner>
    </PageSection>
  );
}
