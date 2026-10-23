import SchedulePage from '@/views/schedule-page/schedule-page';
import { generateSchedulePageMetadata } from '@/views/schedule-page/schedule-page.metadata';
import { type Props } from '@/views/schedule-page/schedule-page.types';

export { generateSchedulePageMetadata as generateMetadata };

export default async function SchedulePageLayout(props: {
  params: Promise<Props['params']>;
  children: React.ReactNode;
}) {
  return (
    <SchedulePage params={await props.params}>{props.children}</SchedulePage>
  );
}
