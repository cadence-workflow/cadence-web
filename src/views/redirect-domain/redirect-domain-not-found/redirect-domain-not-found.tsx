'use client';
import { useParams } from 'next/navigation';

import ErrorPanel from '@/components/error-panel/error-panel';

import { type RouteParams } from '../redirect-domain.types';

export default function RedirectDomainNotFound() {
  const { domainParams } = useParams<RouteParams>();

  const domain = decodeURIComponent(domainParams[0]);

  return (
    <ErrorPanel
      message={`The domain "${domain}" was not found`}
      actions={[
        {
          kind: 'link-internal',
          label: 'Go to domain overview',
          link: '/domains',
        },
      ]}
      omitLogging={true}
    />
  );
}
