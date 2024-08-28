'use client';
import { useParams } from 'next/navigation';

import ErrorPanel from '@/components/error-panel/error-panel';
import { RequestError } from '@/utils/request/request-error';

import { type Props } from './domain-page-error.types';

export default function DomainPageError({ error, reset }: Props) {
  const { domain } = useParams();

  if (error instanceof RequestError && error.status === 404) {
    return (
      <ErrorPanel
        error={error}
        message={`The domain "${domain}" was not found`}
        actions={[
          {
            kind: 'link-internal',
            label: 'Go to domain overview',
            link: '/domains',
          },
        ]}
        reset={reset}
        omitLogging={true}
      />
    );
  }

  return (
    <ErrorPanel
      error={error}
      message="Failed to load domain"
      actions={[
        {
          kind: 'retry',
          label: 'Retry',
        },
      ]}
      reset={reset}
    />
  );
}
