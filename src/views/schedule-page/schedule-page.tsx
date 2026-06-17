import React from 'react';

import decodeUrlParams from '@/utils/decode-url-params';

import SchedulePageHeader from './schedule-page-header/schedule-page-header';
import { type Props } from './schedule-page.types';

export default function SchedulePage({ params, children }: Props) {
  const decodedParams = decodeUrlParams(params) as Props['params'];

  return (
    <>
      <SchedulePageHeader
        domain={decodedParams.domain}
        cluster={decodedParams.cluster}
        scheduleId={decodedParams.scheduleId}
      />
      {children}
    </>
  );
}
