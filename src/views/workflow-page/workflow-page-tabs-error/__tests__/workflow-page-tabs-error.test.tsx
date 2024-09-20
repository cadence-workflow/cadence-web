import React from 'react';

import * as navigationModule from 'next/navigation';

import { render, screen } from '@/test-utils/rtl';

import WorkflowPageTabsError from '../workflow-page-tabs-error';
import type { WorkflowPageTabsErrorConfig } from '../workflow-page-tabs-error.types';

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(({ message }: { message: string }) => <div>{message}</div>)
);

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useParams: jest.fn(() => ({
    domain: 'test-domain',
    cluster: 'test-cluster',
    workflowTab: 'summary',
  })),
}));

jest.mock(
  '../../config/workflow-page-tabs-error.config',
  () =>
    ({
      summary: () => ({
        message: 'summary error',
      }),
      history: () => ({
        message: 'history error',
      }),
      queries: () => ({
        message: 'queries error',
      }),
    }) as const satisfies WorkflowPageTabsErrorConfig
);

describe('WorkflowPageTabsError', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders tab error correctly when workflow tab exists in config', () => {
    setup();
    expect(screen.getByText('summary error')).toBeInTheDocument();
  });

  it('renders tab error with generic text when workflow tab does not exist in config', () => {
    jest.spyOn(navigationModule, 'useParams').mockReturnValue({
      domain: 'test-domain',
      cluster: 'test-cluster',
      workflowTab: 'invalid',
    });
    setup();
    expect(
      screen.getByText('Failed to load workflow content')
    ).toBeInTheDocument();
  });
});

function setup() {
  render(
    <WorkflowPageTabsError
      error={new Error('something bad happened')}
      reset={() => {}}
    />
  );
}
