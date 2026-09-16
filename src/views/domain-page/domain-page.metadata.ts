import { type Metadata } from 'next';

import { type GenerateMetadataProps } from './domain-page.types';

export async function generateDomainPageMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { domain } = await params;
  return { title: domain };
}
