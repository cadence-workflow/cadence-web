import { type Metadata } from 'next';

import DomainsPage from '@/views/domains-page/domains-page';

export const dynamic = 'force-dynamic'; // prevent executing the page during build

export const metadata: Metadata = {
  title: 'All Domains',
};

export default DomainsPage;
