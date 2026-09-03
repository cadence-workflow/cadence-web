import { type Metadata } from 'next';

import DomainsPage from '@/views/domains-page/domains-page';
import { domainsPageMetadata } from '@/views/domains-page/domains-page.metadata';

export const dynamic = 'force-dynamic'; // prevent executing the page during build

export const metadata: Metadata = domainsPageMetadata;

export default DomainsPage;
