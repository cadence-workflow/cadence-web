'use client';
import React from 'react';

import { Banner, HIERARCHY, KIND } from 'baseui/banner';
import { MdInfoOutline } from 'react-icons/md';

import PageSection from '@/components/page-section/page-section';
import useDescribeSchedule from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule';

import buildPausedBannerMessage from './helpers/build-paused-banner-message';
import formatPausedAtTimestamp from './helpers/format-paused-at-timestamp';
import {
  overrides,
  PAUSED_BANNER_ICON_SIZE,
} from './schedule-page-paused-banner.styles';
import { type Props } from './schedule-page-paused-banner.types';

export default function SchedulePagePausedBanner(props: Props) {
  const { data: scheduleDetails, isLoading, isError } = useDescribeSchedule(props);

  if (isLoading || isError || !scheduleDetails?.state?.paused) {
    return null;
  }

  const pauseInfo = scheduleDetails.state.pauseInfo;
  const pausedAt = formatPausedAtTimestamp(pauseInfo?.pausedAt);
  const pausedBy = pauseInfo?.pausedBy?.trim() || null;
  const reason = pauseInfo?.reason?.trim() || null;

  return (
    <PageSection>
      <Banner
        hierarchy={HIERARCHY.low}
        kind={KIND.warning}
        artwork={{
          icon: () => (
            <MdInfoOutline size={PAUSED_BANNER_ICON_SIZE} aria-hidden />
          ),
        }}
        overrides={overrides.banner}
      >
        {buildPausedBannerMessage({ pausedAt, pausedBy, reason })}
      </Banner>
    </PageSection>
  );
}
