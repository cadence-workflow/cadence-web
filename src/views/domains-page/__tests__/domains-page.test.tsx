import React, { Suspense } from 'react';

import { render, screen, waitFor } from '@/test-utils/rtl';

import type { HttpEndpointMock } from '@/test-utils/msw-mock-handlers/msw-mock-handlers.types';

import DomainsPage from '../domains-page';

jest.mock('../domains-page-content/domains-page-content', () =>
  jest.fn(() => <div data-testid="mock-content" />)
);

describe(DomainsPage.name, () => {
  it('renders the domains page content', async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByTestId('mock-content')).toBeInTheDocument();
    });
  });
});

function setup() {
  const endpointsMocks: HttpEndpointMock[] = [
    {
      path: '/api/config',
      httpMethod: 'GET',
      mockOnce: false,
      jsonResponse: [
        { clusterName: 'cluster-a' },
        { clusterName: 'cluster-b' },
      ],
    },
  ];

  render(
    <Suspense fallback={<div>Loading...</div>}>
      <DomainsPage />
    </Suspense>,
    { endpointsMocks }
  );
}
