import SchedulePageHeader from './schedule-page-header/schedule-page-header';
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
      {children}
    </>
  );
}
