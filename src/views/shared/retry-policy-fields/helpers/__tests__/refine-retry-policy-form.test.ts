import { type z } from 'zod';

import refineRetryPolicyForm from '../refine-retry-policy-form';

describe(refineRetryPolicyForm.name, () => {
  it('accepts when retry policy is disabled', () => {
    expect(getIssues({ enableRetryPolicy: false })).toEqual([]);
  });

  it('requires initial interval and backoff coefficient when enabled', () => {
    expect(
      getIssues({
        enableRetryPolicy: true,
        limitRetries: 'ATTEMPTS',
      })
    ).toEqual([
      expect.objectContaining({
        path: ['retryPolicy', 'initialIntervalSeconds'],
        message: 'Initial interval is required',
      }),
      expect.objectContaining({
        path: ['retryPolicy', 'backoffCoefficient'],
        message: 'Backoff coefficient is required',
      }),
      expect.objectContaining({
        path: ['retryPolicy', 'maximumAttempts'],
        message: 'Maximum attempts is required',
      }),
    ]);
  });

  it('requires maximum attempts when limit is ATTEMPTS', () => {
    expect(
      getIssues({
        enableRetryPolicy: true,
        limitRetries: 'ATTEMPTS',
        retryPolicy: {
          initialIntervalSeconds: 10,
          backoffCoefficient: 2,
        },
      })
    ).toEqual([
      expect.objectContaining({
        path: ['retryPolicy', 'maximumAttempts'],
        message: 'Maximum attempts is required',
      }),
    ]);
  });

  it('requires expiration interval when limit is DURATION', () => {
    expect(
      getIssues({
        enableRetryPolicy: true,
        limitRetries: 'DURATION',
        retryPolicy: {
          initialIntervalSeconds: 10,
          backoffCoefficient: 2,
        },
      })
    ).toEqual([
      expect.objectContaining({
        path: ['retryPolicy', 'expirationIntervalSeconds'],
        message: 'Expiration interval is required',
      }),
    ]);
  });
});

function getIssues(
  overrides: Parameters<typeof refineRetryPolicyForm>[0] = {
    enableRetryPolicy: false,
    limitRetries: 'ATTEMPTS',
  }
) {
  const issues: Array<z.IssueData> = [];

  refineRetryPolicyForm(
    {
      enableRetryPolicy: false,
      limitRetries: 'ATTEMPTS',
      ...overrides,
    },
    {
      addIssue: (issue) => {
        issues.push(issue);
      },
    } as z.RefinementCtx
  );

  return issues;
}
