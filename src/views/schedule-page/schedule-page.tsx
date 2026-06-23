import React, { Suspense } from 'react';

import SchedulePageHeader from './schedule-page-header/schedule-page-header';
import SchedulePagePausedBanner from './schedule-page-paused-banner/schedule-page-paused-banner';
import SchedulePageTabs from './schedule-page-tabs/schedule-page-tabs';
import { type Props } from './schedule-page.types';

export default function SchedulePage({ params, children }: Props) {
  return (
    <>
      <SchedulePageHeader
        domain={params.domain}
        cluster={params.cluster}
        scheduleId={params.scheduleId}
      />
      <SchedulePageTabs />
      <Suspense fallback={null}>
        <SchedulePagePausedBanner
          domain={params.domain}
          cluster={params.cluster}
          scheduleId={params.scheduleId}
        />
      </Suspense>
      {children}
    </>
  );
}
