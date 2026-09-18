import { type Metadata } from 'next';

import { type GenerateMetadataProps } from './workflow-page.types';

export async function generateWorkflowPageMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { domain, workflowId } = await params;
  return { title: `${domain} - ${workflowId}` };
}
