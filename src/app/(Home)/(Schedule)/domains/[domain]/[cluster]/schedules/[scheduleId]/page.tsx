import { redirect } from 'next/navigation';

import { DEFAULT_SCHEDULE_DETAIL_TAB } from '@/views/domain-schedules/schedule-detail-page/schedule-detail-tabs.config';

type Props = {
  params: {
    domain: string;
    cluster: string;
    scheduleId: string;
  };
};

export default function ScheduleDetailRedirectPage({ params }: Props) {
  redirect(
    `/domains/${encodeURIComponent(params.domain)}/${encodeURIComponent(params.cluster)}/schedules/${encodeURIComponent(params.scheduleId)}/${DEFAULT_SCHEDULE_DETAIL_TAB}`
  );
}
