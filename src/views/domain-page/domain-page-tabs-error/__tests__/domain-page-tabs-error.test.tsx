import React from 'react';

import * as navigationModule from 'next/navigation';

import { render, screen } from '@/test-utils/rtl';

import DomainPageTabsError from '../domain-page-tabs-error';

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(({ message }: { message: string }) => <div>{message}</div>)
);

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useParams: jest.fn(() => ({
    domain: 'test-domain',
    cluster: 'test-cluster',
    domainTab: 'workflows',
  })),
}));

jest.mock(
  '../../config/domain-page-tabs.config',
  () =>
    ({
      workflows: {
        getErrorConfig: () => ({
          message: 'workflow error',
        }),
      },
      metadata: {
        getErrorConfig: () => ({
          message: 'metadata error',
        }),
      },
      settings: {
        getErrorConfig: () => ({
          message: 'settings error',
        }),
      },
      archival: {
        getErrorConfig: () => ({
          message: 'archival error',
        }),
      },
    }) as const
);

describe(DomainPageTabsError.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders tab error correctly when domain tab exists in config', () => {
    setup();
    expect(screen.getByText('workflow error')).toBeInTheDocument();
  });

  it('renders tab error with generic text when domain tab does not exist in config', () => {
    jest.spyOn(navigationModule, 'useParams').mockReturnValue({
      domain: 'test-domain',
      cluster: 'test-cluster',
      domainTab: 'invalid',
    });
    setup();
    expect(
      screen.getByText('Failed to load domain content')
    ).toBeInTheDocument();
  });
});

function setup() {
  render(
    <DomainPageTabsError
      error={new Error('something bad happened')}
      reset={() => {}}
    />
  );
}
