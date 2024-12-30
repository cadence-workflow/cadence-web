'use client';
import { useParams } from 'next/navigation';

import ErrorPanel from '@/components/error-panel/error-panel';
import { RequestError } from '@/utils/request/request-error';

import { type Props } from './workflow-page-error.types';

export default function WorkflowPageError({ error, reset }: Props) {
  const { domain, cluster } = useParams();

  if (error instanceof RequestError && error.status === 404) {
    return (
      <ErrorPanel
        error={error}
        message={`Workflow was not found, it may have passed retention period`}
        actions={[
          {
            kind: 'link-internal',
            label: 'Go to domain page',
            link: `/domains/${domain}/${cluster}`,
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
      message="Failed to load workflow"
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
