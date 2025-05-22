import { Suspense } from 'react';

import { HttpResponse } from 'msw';
import { act } from 'react-dom/test-utils';

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
    let renderErrorMessage;
    try {
      await act(async () => {
        await setup({ error: true });
      });
    } catch (error) {
      if (error instanceof Error) {
        renderErrorMessage = error.message;
      }
    }

    expect(renderErrorMessage).toEqual('Failed to fetch cluster info');
  });
});

async function setup({
  isAdvancedVisibility = false,
  error,
}: {
  error?: boolean;
  isAdvancedVisibility?: boolean;
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
          path: '/api/clusters/test-cluster',
          httpMethod: 'GET',
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
      ],
    }
  );
}
