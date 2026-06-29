'use client';
import React, { useMemo } from 'react';

import { Banner, HIERARCHY, KIND } from 'baseui/banner';
import { MdInfoOutline } from 'react-icons/md';

import PageSection from '@/components/page-section/page-section';
import useDescribeSchedule from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule';

import { formatScheduleTimestamp } from '../helpers/format-schedule-timestamp';

import {
  overrides,
  PAUSED_BANNER_ICON_SIZE,
  styled,
} from './schedule-details-paused-banner.styles';
import { type Props } from './schedule-details-paused-banner.types';

export default function ScheduleDetailsPausedBanner(props: Props) {
  const {
    data: scheduleDetails,
    isLoading,
    isError,
  } = useDescribeSchedule(props);

  const isPaused =
    !isLoading && !isError && Boolean(scheduleDetails?.state?.paused);
  const pauseInfo = scheduleDetails?.state?.pauseInfo;

  const message = useMemo(() => {
    if (!isPaused) {
      return null;
    }

    const pausedAt = formatScheduleTimestamp(pauseInfo?.pausedAt);
    const pausedBy = pauseInfo?.pausedBy?.trim() || null;
    const reason = pauseInfo?.reason?.trim() || null;

    return (
      <>
        Schedule was paused
        {pausedAt ? (
          <>
            {' '}
            <styled.ValueText>{pausedAt}</styled.ValueText>
          </>
        ) : null}
        {pausedBy ? (
          <>
            {' by '}
            <styled.ValueText>{pausedBy}</styled.ValueText>
          </>
        ) : null}
        {reason ? (
          <>
            {'. Reason: "'}
            <styled.ValueText>{reason}</styled.ValueText>
            {'"'}
          </>
        ) : null}
      </>
    );
  }, [isPaused, pauseInfo]);

  if (!isPaused) {
    return null;
  }

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
        {message}
      </Banner>
    </PageSection>
  );
}
