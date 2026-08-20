import { type Metadata } from 'next';

import SchedulePage from '@/views/schedule-page/schedule-page';

type Props = {
  params: Promise<{ domain: string; cluster: string; scheduleId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain, scheduleId } = await params;
  return { title: `${domain} - ${scheduleId}` };
}

export default SchedulePage;
