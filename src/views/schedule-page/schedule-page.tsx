import React from 'react';

import decodeUrlParams from '@/utils/decode-url-params';
import ScheduleDetailsPageHeader from '@/views/schedule-details-page/schedule-details-page-header/schedule-details-page-header';

import { type Props } from './schedule-page.types';

export default function SchedulePage({ params, children }: Props) {
  const decodedParams = decodeUrlParams(params) as Props['params'];

  return (
    <>
      <ScheduleDetailsPageHeader
        domain={decodedParams.domain}
        cluster={decodedParams.cluster}
        scheduleId={decodedParams.scheduleId}
      />
      {children}
    </>
  );
}
