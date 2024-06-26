import { Suspense } from 'react';

import { render, screen, act } from '@/test-utils/rtl';

import * as requestModule from '@/utils/request';

import { mockDomainInfo } from '../../__fixtures__/domain-info';
import { type DomainInfo } from '../../domain-page.types';
import DomainPageMetadata from '../domain-page-metadata';

jest.mock('@/components/list-table/list-table', () =>
  jest.fn(({ data }: { data: DomainInfo }) => (
    <div>
      Mock metadata table
      <div>Domain ID: {data.id}</div>
      <div>Active cluster: {data.activeClusterName}</div>
    </div>
  ))
);

jest.mock('@/utils/request');

describe(DomainPageMetadata.name, () => {
  it('renders metadata without error', async () => {
    await setup({});

    expect(await screen.findByText('Mock metadata table')).toBeInTheDocument();
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

    expect(renderErrorMessage).toEqual('Failed to fetch domain metadata');
  });
});

async function setup({ error }: { error?: boolean }) {
  // TODO: @adhitya.mamallan - This is not type-safe, explore using a library such as nock or msw
  const requestMock = jest.spyOn(requestModule, 'default') as jest.Mock;

  if (error) {
    requestMock.mockResolvedValue({
      ok: false,
    });
  } else {
    requestMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockDomainInfo),
    });
  }

  render(
    <Suspense>
      <DomainPageMetadata domain="mock-domain" cluster="mock-cluster" />
    </Suspense>
  );
}
