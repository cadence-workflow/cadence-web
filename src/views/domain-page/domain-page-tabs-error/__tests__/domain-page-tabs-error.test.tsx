import React from 'react';

import * as navigationModule from 'next/navigation';

import { render, screen } from '@/test-utils/rtl';

import DomainPageTabsError from '../domain-page-tabs-error';
import type { DomainPageTabsErrorConfig } from '../domain-page-tabs-error.types';

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
  '../../config/domain-page-tabs-error.config',
  () =>
    ({
      workflows: () => ({
        message: 'workflow error',
      }),
      metadata: () => ({
        message: 'metadata error',
      }),
      settings: () => ({
        message: 'settings error',
      }),
    }) as const satisfies DomainPageTabsErrorConfig
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
