import { type Metadata } from 'next';

import { type Props } from './task-list-page.types';

type GenerateMetadataProps = {
  params: Promise<Props['params']>;
};

export async function generateTaskListPageMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { domain, taskListName } = await params;
  return { title: `${domain} - ${taskListName}` };
}
