import { z } from 'zod';

import { UseMergedInfiniteQueriesError } from '@/hooks/use-merged-infinite-queries/use-merged-infinite-queries-error';
import { RequestError } from '@/utils/request/request-error';

import getWorkflowsBasicErrorPanelProps from '../get-workflows-basic-error-panel-props';

describe(getWorkflowsBasicErrorPanelProps.name, () => {
  it('returns default error panel props for regular error', () => {
    expect(
      getWorkflowsBasicErrorPanelProps({
        error: new UseMergedInfiniteQueriesError('Test error', [
          new RequestError('Something went wrong', 500),
        ]),
        areSearchParamsAbsent: false,
      })
    ).toEqual({
      message: 'Failed to fetch workflows',
      actions: [{ kind: 'retry', label: 'Retry' }],
    });
  });

  it('returns validation error if the backend returns one', () => {
    expect(
      getWorkflowsBasicErrorPanelProps({
        error: new UseMergedInfiniteQueriesError('Test error', [
          new RequestError('Invalid input', 400, [
            {
              code: z.ZodIssueCode.custom,
              path: ['test-path'],
              message: 'Incorrect field value',
            },
          ]),
        ]),
        areSearchParamsAbsent: false,
      })
    ).toEqual({
      message: 'Validation error: Incorrect field value',
    });
  });

  it('returns "not found" error panel props when search params are absent', () => {
    expect(
      getWorkflowsBasicErrorPanelProps({
        error: null,
        areSearchParamsAbsent: true,
      })
    ).toEqual({
      message: 'No workflows found for this domain',
      omitLogging: true,
      actions: [
        {
          kind: 'link-external',
          label: 'Get started on workflows',
          link: 'https://cadenceworkflow.io/docs/concepts/workflows',
        },
      ],
    });
  });

  it('returns undefined in all other cases', () => {
    expect(
      getWorkflowsBasicErrorPanelProps({
        error: null,
        areSearchParamsAbsent: false,
      })
    ).toBeUndefined();
  });
});
