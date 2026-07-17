import decodeUrlParams from '@/utils/decode-url-params';
import SchedulePageHeader from './schedule-page-header/schedule-page-header';
import SchedulePageTabs from './schedule-page-tabs/schedule-page-tabs';
import { SchedulePageParams, type Props } from './schedule-page.types';

export default function SchedulePage({ params, children }: Props) {
  const decodedParams = decodeUrlParams(params) as SchedulePageParams;
  return (
    <>
      <SchedulePageHeader
        domain={decodedParams.domain}
        cluster={decodedParams.cluster}
        scheduleId={decodedParams.scheduleId}
      />
      <SchedulePageTabs />
      {children}
    </>
  );
}
