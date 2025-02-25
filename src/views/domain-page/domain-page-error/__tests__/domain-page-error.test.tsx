import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { RequestError } from '@/utils/request/request-error';

import DomainPageError from '../domain-page-error';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useParams: () => ({
    domain: 'test-domain',
    cluster: 'test-cluster',
    domainTab: 'workflows',
  }),
}));

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(({ message }: { message: string }) => <div>{message}</div>)
);

describe(DomainPageError.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders error page correctly', () => {
    render(
      <DomainPageError
        error={new Error('something bad happened')}
        reset={() => {}}
      />
    );
    expect(screen.getByText('Failed to load domain')).toBeInTheDocument();
  });

  it('renders "not found" error page correctly', () => {
    render(
      <DomainPageError
        error={
          new RequestError('Could not find domain', '/domains/mock-domain', 404)
        }
        reset={() => {}}
      />
    );
    expect(
      screen.getByText('The domain "test-domain" was not found')
    ).toBeInTheDocument();
  });

  it('renders "forbidden" error page correctly', () => {
    render(
      <DomainPageError
        error={new RequestError('forbidden', '/domains/mock-domain', 403)}
        reset={() => {}}
      />
    );
    expect(
      screen.getByText('Access denied for domain "test-domain"')
    ).toBeInTheDocument();
  });
});
