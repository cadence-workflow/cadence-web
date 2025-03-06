'use client';
import { useParams } from 'next/navigation';

import ErrorPanel from '@/components/error-panel/error-panel';

import { type RouteParams } from '../redirect-domain.types';

import { type Props } from './redirect-domain-error.types';

export default function RedirectDomainError({ error }: Props) {
  const { domainParams } = useParams<RouteParams>();

  const domain = decodeURIComponent(domainParams[0]);

  return (
    <ErrorPanel
      error={error}
      message={`Could not redirect to domain "${domain}"`}
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
