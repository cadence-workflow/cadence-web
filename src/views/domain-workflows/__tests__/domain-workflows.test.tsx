import React, { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { render, screen } from '@/test-utils/rtl';

import { type DescribeClusterResponse } from '@/route-handlers/describe-cluster/describe-cluster.types';
import { type DomainPageTabContentProps } from '@/views/domain-page/domain-page-content/domain-page-content.types';

import DomainWorkflows from '../domain-workflows';

jest.mock('@/views/domain-workflows-basic/domain-workflows-basic', () =>
  jest.fn(() => <div>Basic Workflows</div>)
);
jest.mock('../domain-workflows-advanced/domain-workflows-advanced', () =>
  jest.fn(() => <div>Advanced Workflows</div>)
);

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: string | null }
> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error: error.message };
  }
  render() {
    if (this.state.error) return <div>{this.state.error}</div>;
    return this.props.children;
  }
}

describe('DomainWorkflows', () => {
  it('should render basic workflows table when advanced visibility is disabled', async () => {
    await setup({ isAdvancedVisibility: false });

    expect(await screen.findByText('Basic Workflows')).toBeInTheDocument();
  });

  it('should render advanced workflows table when advanced visibility is enabled', async () => {
    await setup({ isAdvancedVisibility: true });

    expect(await screen.findByText('Advanced Workflows')).toBeInTheDocument();
  });

  it('should throw on error', async () => {
    await setup({ error: true });

    expect(
      await screen.findByText('Failed to fetch cluster info')
    ).toBeInTheDocument();
  });

  it('should render advanced workflows for non-admin users when advanced visibility probe succeeds', async () => {
    await setup({
      authResponse: {
        authEnabled: true,
        auth: { isValidToken: true },
        isAdmin: false,
        groups: ['reader'],
      },
      isAdvancedVisibilityProbeEnabled: true,
    });

    expect(await screen.findByText('Advanced Workflows')).toBeInTheDocument();
  });

  it('should render basic workflows for non-admin users when advanced visibility probe fails', async () => {
    await setup({
      authResponse: {
        authEnabled: true,
        auth: { isValidToken: true },
        isAdmin: false,
        groups: ['reader'],
      },
      isAdvancedVisibilityProbeEnabled: false,
    });

    expect(await screen.findByText('Basic Workflows')).toBeInTheDocument();
  });
});

async function setup({
  isAdvancedVisibility = false,
  error,
  authResponse = {
    authEnabled: false,
    auth: { isValidToken: false },
    isAdmin: false,
    groups: [],
  },
  isAdvancedVisibilityProbeEnabled,
}: {
  isAdvancedVisibility?: boolean;
  error?: boolean;
  authResponse?: Record<string, unknown>;
  isAdvancedVisibilityProbeEnabled?: boolean;
}) {
  const props: DomainPageTabContentProps = {
    domain: 'test-domain',
    cluster: 'test-cluster',
  };

  render(
    <ErrorBoundary>
      <Suspense>
        <DomainWorkflows {...props} />
      </Suspense>
    </ErrorBoundary>,
    {
      endpointsMocks: [
        {
          path: '/api/config',
          httpMethod: 'GET',
          mockOnce: false,
          jsonResponse: false,
        },
        {
          path: '/api/auth/me',
          httpMethod: 'GET',
          mockOnce: false,
          jsonResponse: authResponse,
        },
        {
          path: '/api/clusters/test-cluster',
          httpMethod: 'GET' as const,
          mockOnce: false,
          ...(error
            ? {
                httpResolver: () => {
                  return HttpResponse.json(
                    { message: 'Failed to fetch cluster info' },
                    { status: 500 }
                  );
                },
              }
            : {
                jsonResponse: {
                  persistenceInfo: {
                    visibilityStore: {
                      features: [
                        {
                          key: 'advancedVisibilityEnabled',
                          enabled: isAdvancedVisibility,
                        },
                      ],
                      backend: '',
                      settings: [],
                    },
                  },
                  supportedClientVersions: null,
                } satisfies DescribeClusterResponse,
              }),
        },
        ...(isAdvancedVisibilityProbeEnabled !== undefined
          ? [
              {
                path: '/api/domains/:domain/:cluster/workflows',
                httpMethod: 'GET' as const,
                mockOnce: false,
                ...(isAdvancedVisibilityProbeEnabled
                  ? {
                      jsonResponse: {
                        workflows: [],
                        nextPage: '',
                      },
                    }
                  : {
                      httpResolver: () => {
                        return HttpResponse.json(
                          { message: 'Advanced visibility is not supported' },
                          { status: 404 }
                        );
                      },
                    }),
              },
            ]
          : []),
      ],
    }
  );
}
