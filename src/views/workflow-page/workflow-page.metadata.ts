import { type Metadata } from 'next';

import { type Props } from './workflow-page.types';

type GenerateMetadataProps = {
  params: Promise<Props['params']>;
};

export async function generateWorkflowPageMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { domain, workflowId } = await params;
  return { title: `${domain} - ${workflowId}` };
}
