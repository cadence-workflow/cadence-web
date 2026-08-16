'use client';
import { useParams } from 'next/navigation';

import ErrorPanel from '@/components/error-panel/error-panel';

import { type RouteParams } from '../redirect-workflow.types';

export default function RedirectWorkflowNotFound() {
  const { workflowParams } = useParams<RouteParams>();

  const [domain, cluster, workflowId] = workflowParams;

  return (
    <ErrorPanel
      message={`The workflow "${workflowId}" was not found, it may have passed retention period`}
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
