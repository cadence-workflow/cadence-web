import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import DomainPageContent from '../domain-page-content';
import type {
  DomainPageContentParams,
  DomainPageTabContentProps,
} from '../domain-page-content.types';

const mockNotFound = jest.fn();
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  notFound: () => mockNotFound(),
}));

const MockedTabContent = ({
  domain,
  cluster,
  tab,
}: DomainPageTabContentProps & { tab: string }) => (
  <div>
    Mock Tab {tab} -- Domain: {domain}, Cluster: {cluster}
  </div>
);

jest.mock('../../config/domain-page-tabs.config', () => ({
  workflows: {
    content: (props: DomainPageTabContentProps) => (
      <MockedTabContent {...props} tab="workflows" />
    ),
  },
  metadata: {
    content: (props: DomainPageTabContentProps) => (
      <MockedTabContent {...props} tab="metadata" />
    ),
  },
  settings: {
    content: (props: DomainPageTabContentProps) => (
      <MockedTabContent {...props} tab="settings" />
    ),
  },
  archival: {
    content: (props: DomainPageTabContentProps) => (
      <MockedTabContent {...props} tab="archival" />
    ),
  },
}));

const mockParams: DomainPageContentParams = {
  domain: 'mock-domain',
  cluster: 'mock-cluster',
  domainTab: 'workflows',
};

describe('DomainPageContent', () => {
  it('renders tab content with correct params when domain tab exists in config', () => {
    render(<DomainPageContent params={mockParams} />);
    expect(
      screen.getByText(
        'Mock Tab workflows -- Domain: mock-domain, Cluster: mock-cluster'
      )
    ).toBeInTheDocument();
  });

  it('throws a Not Found error if domain tab does not exist in config', () => {
    render(
      // @ts-expect-error allow passing unknown domainTab to test recieving wrong value as a param
      <DomainPageContent params={{ ...mockParams, domainTab: 'unknown-tab' }} />
    );
    expect(mockNotFound).toHaveBeenCalled();
  });
});
