import { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { render, screen, waitFor } from '@/test-utils/rtl';

import { type DescribeClusterResponse } from '@/route-handlers/describe-cluster/describe-cluster.types';
import { type DomainPageTabContentProps } from '@/views/domain-page/domain-page-content/domain-page-content.types';

import DomainWorkflows from '../domain-workflows';

jest.mock('@/views/domain-workflows-basic/domain-workflows-basic', () =>
  jest.fn(() => <div>Basic Workflows</div>)
);
jest.mock('../domain-workflows-advanced/domain-workflows-advanced', () =>
  jest.fn(() => <div>Advanced Workflows</div>)
);

describe('DomainWorkflows', () => {
  it('should render basic workflows table when advanced visibility is disabled', async () => {
    await setup({ isAdvancedVisibility: false });

    expect(await screen.findByText('Basic Workflows')).toBeInTheDocument();
  });

  it('should render advanced workflows table when advanced visibility is enabled', async () => {
    await setup({ isAdvancedVisibility: true });

    expect(await screen.findByText('Advanced Workflows')).toBeInTheDocument();
  });

  it('should fall back to basic workflows when cluster info fails', async () => {
    await setup({ error: true });

    expect(await screen.findByText('Basic Workflows')).toBeInTheDocument();
  });

  it('should render advanced workflows for authenticated non-admin users when advanced visibility probe succeeds', async () => {
    await setup({
      authResponse: {
        authEnabled: true,
        isAuthenticated: true,
        isAdmin: false,
        groups: ['reader'],
      },
      isAdvancedVisibilityProbeEnabled: true,
    });

    expect(await screen.findByText('Advanced Workflows')).toBeInTheDocument();
  });

  it('should render basic workflows for authenticated non-admin users when advanced visibility probe fails', async () => {
    await setup({
      authResponse: {
        authEnabled: true,
        isAuthenticated: true,
        isAdmin: false,
        groups: ['reader'],
      },
      isAdvancedVisibilityProbeEnabled: false,
    });

    expect(await screen.findByText('Basic Workflows')).toBeInTheDocument();
  });

  it('should not refetch cluster info when only domain changes', async () => {
    const clusterRequestHandler = jest.fn(() =>
      HttpResponse.json({
        persistenceInfo: {
          visibilityStore: {
            features: [
              {
                key: 'advancedVisibilityEnabled',
                enabled: false,
              },
            ],
            backend: '',
            settings: [],
          },
        },
        supportedClientVersions: null,
      } satisfies DescribeClusterResponse)
    );

    const { rerender } = render(
      <Suspense>
        <DomainWorkflows domain="domain-a" cluster="test-cluster" />
      </Suspense>,
      {
        endpointsMocks: [
          {
            path: '/api/auth/me',
            httpMethod: 'GET',
            mockOnce: false,
            jsonResponse: { groups: [] },
          },
          {
            path: '/api/clusters/test-cluster',
            httpMethod: 'GET',
            mockOnce: false,
            httpResolver: clusterRequestHandler,
          },
        ],
      }
    );

    expect(await screen.findByText('Basic Workflows')).toBeInTheDocument();

    rerender(
      <Suspense>
        <DomainWorkflows domain="domain-b" cluster="test-cluster" />
      </Suspense>
    );

    expect(await screen.findByText('Basic Workflows')).toBeInTheDocument();
    await waitFor(() => {
      expect(clusterRequestHandler).toHaveBeenCalledTimes(1);
    });
  });

  it('should refetch cluster info when cluster changes', async () => {
    const getClusterResponse = (isAdvancedVisibility: boolean) =>
      HttpResponse.json({
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
      } satisfies DescribeClusterResponse);

    const clusterARequestHandler = jest.fn(() => getClusterResponse(false));
    const clusterBRequestHandler = jest.fn(() => getClusterResponse(true));

    const { rerender } = render(
      <Suspense>
        <DomainWorkflows domain="domain-a" cluster="cluster-a" />
      </Suspense>,
      {
        endpointsMocks: [
          {
            path: '/api/auth/me',
            httpMethod: 'GET',
            mockOnce: false,
            jsonResponse: { groups: [] },
          },
          {
            path: '/api/clusters/cluster-a',
            httpMethod: 'GET',
            mockOnce: false,
            httpResolver: clusterARequestHandler,
          },
          {
            path: '/api/clusters/cluster-b',
            httpMethod: 'GET',
            mockOnce: false,
            httpResolver: clusterBRequestHandler,
          },
        ],
      }
    );

    expect(await screen.findByText('Basic Workflows')).toBeInTheDocument();
    expect(clusterARequestHandler).toHaveBeenCalledTimes(1);
    expect(clusterBRequestHandler).toHaveBeenCalledTimes(0);

    rerender(
      <Suspense>
        <DomainWorkflows domain="domain-a" cluster="cluster-b" />
      </Suspense>
    );

    expect(await screen.findByText('Advanced Workflows')).toBeInTheDocument();
    await waitFor(() => {
      expect(clusterBRequestHandler).toHaveBeenCalledTimes(1);
    });
  });
});

async function setup({
  isAdvancedVisibility = false,
  error,
  authResponse = {
    groups: [],
  },
  skipClusterRequest = false,
  isAdvancedVisibilityProbeEnabled,
}: {
  error?: boolean;
  isAdvancedVisibility?: boolean;
  authResponse?: Record<string, unknown>;
  skipClusterRequest?: boolean;
  isAdvancedVisibilityProbeEnabled?: boolean;
}) {
  const props: DomainPageTabContentProps = {
    domain: 'test-domain',
    cluster: 'test-cluster',
  };

  render(
    <Suspense>
      <DomainWorkflows {...props} />
    </Suspense>,
    {
      endpointsMocks: [
        {
          path: '/api/auth/me',
          httpMethod: 'GET',
          mockOnce: false,
          jsonResponse: authResponse,
        },
        ...(skipClusterRequest
          ? []
          : [
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
            ]),
        ...(typeof isAdvancedVisibilityProbeEnabled === 'boolean'
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
