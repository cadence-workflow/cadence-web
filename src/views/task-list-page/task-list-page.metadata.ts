import { type Metadata } from 'next';

import { type GenerateMetadataProps } from './task-list-page.types';

export async function generateTaskListPageMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { domain, taskListName } = await params;
  return { title: `${domain} - ${taskListName}` };
}
