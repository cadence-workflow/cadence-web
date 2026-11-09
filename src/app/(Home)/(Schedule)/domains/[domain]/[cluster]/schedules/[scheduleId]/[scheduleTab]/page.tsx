import SchedulePageTabContent from '@/views/schedule-page/schedule-page-tab-content/schedule-page-tab-content';
import { type Props } from '@/views/schedule-page/schedule-page-tab-content/schedule-page-tab-content.types';

export default async function SchedulePageTabContentPage(props: {
  params: Promise<Props['params']>;
}) {
  return <SchedulePageTabContent params={await props.params} />;
}
