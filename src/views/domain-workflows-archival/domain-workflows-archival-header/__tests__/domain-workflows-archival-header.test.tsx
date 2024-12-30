import { render, screen } from '@/test-utils/rtl';

import { mockDomainPageQueryParamsValues } from '../../../domain-page/__fixtures__/domain-page-query-params';
import DomainWorkflowsArchivalHeader from '../domain-workflows-archival-header';

jest.useFakeTimers().setSystemTime(new Date('2023-05-25'));

const mockSetQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () =>
  jest.fn(() => [mockDomainPageQueryParamsValues, mockSetQueryParams])
);

jest.mock('@/views/shared/workflows-header/workflows-header', () =>
  jest.fn(() => <div>Workflows Header</div>)
);

jest.mock('@/views/shared/hooks/use-list-workflows', () =>
  jest.fn(() => ({
    refetch: jest.fn(),
    isFetching: false,
  }))
);

describe(DomainWorkflowsArchivalHeader.name, () => {
  it('renders workflows header', async () => {
    render(
      <DomainWorkflowsArchivalHeader
        domain="mock_domain"
        cluster="mock_cluster"
      />
    );

    expect(screen.getByText('Workflows Header')).toBeInTheDocument();
  });

  it('pre-fills default start and end dates if not present in query params', async () => {
    render(
      <DomainWorkflowsArchivalHeader
        domain="mock_domain"
        cluster="mock_cluster"
      />
    );

    expect(mockSetQueryParams).toHaveBeenCalledWith('test');
  });
});
