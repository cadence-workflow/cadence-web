import { Suspense } from 'react';

import { render, screen, act } from '@/test-utils/rtl';

import * as requestModule from '@/utils/request';

import { mockDomainDescription } from '../../__fixtures__/domain-description';
import { type DomainDescription } from '../../domain-page.types';
import DomainPageHeaderInfoLoader from '../domain-page-header-info-loader';

jest.mock('../../domain-page-header-info/domain-page-header-info', () =>
  jest.fn(
    ({
      domainDescription,
      cluster,
    }: {
      domainDescription: DomainDescription;
      cluster: string;
    }) => (
      <div>
        Mock domain info for Domain {domainDescription.name} in {cluster}
        <div>Domain ID: {domainDescription.id}</div>
      </div>
    )
  )
);

jest.mock('@/utils/request');

describe(DomainPageHeaderInfoLoader.name, () => {
  it('renders header info without error', async () => {
    await setup({});

    expect(
      await screen.findByText(
        'Mock domain info for Domain mock-domain-staging in cluster_1'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('Domain ID: mock-domain-staging-uuid')
    ).toBeInTheDocument();
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

    expect(renderErrorMessage).toEqual('Failed to fetch domain info');
  });
});

async function setup({ error }: { error?: boolean }) {
  // TODO: @adhitya.mamallan - This is not type-safe, explore using a library such as nock or msw
  const requestMock = jest.spyOn(requestModule, 'default') as jest.Mock;

  if (error) {
    requestMock.mockRejectedValue(new Error('Failed to fetch domain info'));
  } else {
    requestMock.mockResolvedValue({
      json: () => Promise.resolve(mockDomainDescription),
    });
  }

  render(
    <Suspense>
      <DomainPageHeaderInfoLoader
        domain="mock-domain-staging"
        cluster="cluster_1"
      />
    </Suspense>
  );
}
