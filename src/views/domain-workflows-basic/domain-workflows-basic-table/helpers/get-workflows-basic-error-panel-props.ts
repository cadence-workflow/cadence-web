import { type ZodIssue } from 'zod';

import { type Props as ErrorPanelProps } from '@/components/error-panel/error-panel.types';
import { type UseMergedInfiniteQueriesError } from '@/hooks/use-merged-infinite-queries/use-merged-infinite-queries-error';
import { RequestError } from '@/utils/request/request-error';

export default function getWorkflowsBasicErrorPanelProps({
  error,
  areSearchParamsAbsent,
}: {
  error: UseMergedInfiniteQueriesError | null;
  areSearchParamsAbsent: boolean;
}): ErrorPanelProps | undefined {
  if (error) {
    const validationErrors = error.errors.reduce(
      (acc: Array<ZodIssue>, error: Error) => {
        if (error instanceof RequestError && error.validationErrors) {
          error.validationErrors.forEach((err) => acc.push(err));
        }
        return acc;
      },
      []
    );

    if (validationErrors.length > 0) {
      return {
        message: 'Validation error: ' + validationErrors[0].message,
      };
    }

    return {
      message: 'Failed to fetch workflows',
      actions: [{ kind: 'retry', label: 'Retry' }],
    };
  }

  if (areSearchParamsAbsent) {
    return {
      message: 'No workflows found for this domain',
      actions: [
        {
          kind: 'link-external',
          label: 'Get started on workflows',
          link: 'https://cadenceworkflow.io/docs/concepts/workflows',
        },
      ],
      omitLogging: true,
    };
  }

  return undefined;
}
