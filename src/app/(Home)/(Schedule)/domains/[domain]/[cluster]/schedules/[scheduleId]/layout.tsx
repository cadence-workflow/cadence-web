import SchedulePage from '@/views/schedule-page/schedule-page';
import { type Props } from '@/views/schedule-page/schedule-page.types';

export default async function SchedulePageLayout(props: {
  params: Promise<Props['params']>;
  children: React.ReactNode;
}) {
  return (
    <SchedulePage params={await props.params}>{props.children}</SchedulePage>
  );
}
