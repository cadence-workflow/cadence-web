'use client';
import { useParams } from 'next/navigation';

import ErrorPanel from '@/components/error-panel/error-panel';
import { RequestError } from '@/utils/request/request-error';

import { type Props } from './task-list-error.types';

export default function TaskListError({ error, reset }: Props) {
  const { taskListName, domain, cluster } = useParams();

  if (error instanceof RequestError && error.status === 403) {
    return (
      <ErrorPanel
        error={error}
        message={`Access denied for tasklist "${taskListName}"`}
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
  if (error instanceof RequestError && error.status === 404) {
    return (
      <ErrorPanel
        error={error}
        message={`The task list "${taskListName}" was not found`}
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
      message={`Failed to tasks list "${taskListName}"`}
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
