'use client';
import { useParams } from 'next/navigation';

import ErrorPanel from '@/components/error-panel/error-panel';

import { type RouteParams } from '../redirect-workflow.types';

import { type Props } from './redirect-workflow-error.types';

export default function RedirectWorkflowError({ error }: Props) {
  const { workflowParams } = useParams<RouteParams>();

  const [domain, cluster, workflowId] = workflowParams;

  return (
    <ErrorPanel
      error={error}
      message={`Could not redirect to workflow "${workflowId}"`}
      actions={[
        {
          kind: 'link-internal',
          label: 'Go to domain page',
          link: `/domains/${domain}/${cluster}`,
        },
      ]}
      omitLogging={true}
    />
  );
}
