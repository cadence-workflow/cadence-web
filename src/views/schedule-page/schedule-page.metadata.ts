import { type Metadata } from 'next';

import { type Props } from './schedule-page.types';

type GenerateMetadataProps = {
  params: Promise<Props['params']>;
};

export async function generateSchedulePageMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { domain, scheduleId } = await params;
  return { title: `${domain} - ${scheduleId}` };
}
