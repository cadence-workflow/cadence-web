import { type Metadata } from 'next';

import { type Props } from './domain-page.types';

type GenerateMetadataProps = {
  params: Promise<Props['params']>;
};

export async function generateDomainPageMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { domain } = await params;
  return { title: domain };
}
