import { type Metadata } from 'next';

import DomainPage from '@/views/domain-page/domain-page';

type Props = {
  params: Promise<{ domain: string; cluster: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain } = await params;
  return { title: domain };
}

export default DomainPage;
