import { Suspense } from 'react';

import { render, screen, act, waitFor } from '@/test-utils/rtl';

import * as requestModule from '@/utils/request';

import { mockDomainInfo } from '../../__fixtures__/domain-info';
import { type DomainInfo } from '../../domain-page.types';
import DomainPageHeaderStatusTag from '../domain-page-header-status-tag';

jest.mock('@/views/shared/domain-status-tag/domain-status-tag', () =>
  jest.fn(({ status }: { status: string }) => (
    <div data-testid="mock-status-tag">Mock domain status: {status}</div>
  ))
);

jest.mock('@/utils/request');

describe(DomainPageHeaderStatusTag.name, () => {
  it('renders domain status tag for non-registered status', async () => {
    await setup({
      domainInfo: { ...mockDomainInfo, status: 'DOMAIN_STATUS_DEPRECATED' },
    });

    expect(await screen.findByTestId('mock-status-tag')).toBeInTheDocument();
    expect(
      await screen.findByText('Mock domain status: DOMAIN_STATUS_DEPRECATED')
    ).toBeInTheDocument();
  });

  it('renders nothing for registered status', async () => {
    await setup({ domainInfo: mockDomainInfo });

    waitFor(() => {
      expect(screen.queryByTestId('mock-status-tag')).toBeNull();
    });
  });

  it('does not render if the initial call fails', async () => {
    let renderErrorMessage;
    try {
      await act(async () => {
        await setup({ domainInfo: undefined });
      });
    } catch (error) {
      if (error instanceof Error) {
        renderErrorMessage = error.message;
      }
    }

    expect(renderErrorMessage).toEqual('Failed to fetch domain info');
  });
});

async function setup({ domainInfo }: { domainInfo: DomainInfo | undefined }) {
  // TODO: @adhitya.mamallan - This is not type-safe, explore using a library such as nock or msw
  const requestMock = jest.spyOn(requestModule, 'default') as jest.Mock;

  if (!domainInfo) {
    requestMock.mockRejectedValue(new Error('Failed to fetch domain info'));
  } else {
    requestMock.mockResolvedValue({
      json: () => Promise.resolve(domainInfo),
    });
  }

  return render(
    <Suspense>
      <DomainPageHeaderStatusTag
        domain="mock-domain-staging"
        cluster="cluster_1"
      />
    </Suspense>
  );
}
