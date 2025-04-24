import { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { render, screen, act } from '@/test-utils/rtl';

import { type GetConfigResponse } from '@/route-handlers/get-config/get-config.types';

import { mockDomainDescription } from '../../__fixtures__/domain-description';
import DomainPageMetadata from '../domain-page-metadata';
import { type DomainMetadata } from '../domain-page-metadata.types';

jest.mock('../../domain-page-metadata-table/domain-page-metadata-table', () =>
  jest.fn(
    ({ domainDescription, isExtendedMetadataEnabled }: DomainMetadata) => (
      <div>
        {isExtendedMetadataEnabled
          ? 'Mock extended metadata table'
          : 'Mock metadata table'}
        <div>Domain ID: {domainDescription.id}</div>
        <div>Active cluster: {domainDescription.activeClusterName}</div>
      </div>
    )
  )
);

describe(DomainPageMetadata.name, () => {
  it('renders metadata without error', async () => {
    await setup({});

    expect(await screen.findByText('Mock metadata table')).toBeInTheDocument();
    expect(
      screen.getByText('Domain ID: mock-domain-staging-uuid')
    ).toBeInTheDocument();
    expect(screen.getByText('Active cluster: cluster_1')).toBeInTheDocument();
  });

  it('renders extended metadata without error', async () => {
    await setup({ enableExtendedMetadata: true });

    expect(
      await screen.findByText('Mock extended metadata table')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Domain ID: mock-domain-staging-uuid')
    ).toBeInTheDocument();
    expect(screen.getByText('Active cluster: cluster_1')).toBeInTheDocument();
  });

  it('does not render if the initial call fails', async () => {
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

    expect(renderErrorMessage).toEqual('Failed to fetch domain description');
  });
});

async function setup({
  error,
  enableExtendedMetadata,
}: {
  error?: boolean;
  enableExtendedMetadata?: boolean;
}) {
  render(
    <Suspense>
      <DomainPageMetadata domain="mock-domain" cluster="mock-cluster" />
    </Suspense>,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => {
            if (error) {
              return HttpResponse.json(
                { message: 'Failed to fetch domain description' },
                { status: 500 }
              );
            } else {
              return HttpResponse.json(mockDomainDescription);
            }
          },
        },
        {
          path: '/api/config',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => {
            if (error) {
              return HttpResponse.json(
                { message: 'Failed to fetch config' },
                { status: 500 }
              );
            } else {
              return HttpResponse.json({
                metadata: enableExtendedMetadata ?? false,
                issues: false,
              } satisfies GetConfigResponse<'EXTENDED_DOMAIN_INFO_ENABLED'>);
            }
          },
        },
      ],
    }
  );
}
