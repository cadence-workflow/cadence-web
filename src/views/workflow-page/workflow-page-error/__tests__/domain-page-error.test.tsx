import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { RequestError } from '@/utils/request/request-error';

import WorkflowPageError from '../workflow-page-error';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useParams: () => ({
    domain: 'test-domain',
    cluster: 'test-cluster',
  }),
}));

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(({ message }: { message: string }) => <div>{message}</div>)
);

describe(WorkflowPageError.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders error page correctly', () => {
    render(
      <WorkflowPageError
        error={new Error('something bad happened')}
        reset={() => {}}
      />
    );
    expect(screen.getByText('Failed to load workflow')).toBeInTheDocument();
  });

  it('renders "not found" error page correctly', () => {
    render(
      <WorkflowPageError
        error={new RequestError('Could not find workflow', 404)}
        reset={() => {}}
      />
    );
    expect(
      screen.getByText(
        'Workflow was not found, it may have passed retention period'
      )
    ).toBeInTheDocument();
  });
});
