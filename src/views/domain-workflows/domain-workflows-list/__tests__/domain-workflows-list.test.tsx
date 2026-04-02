import { HttpResponse } from 'msw';

import { render, screen } from '@/test-utils/rtl';

import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';
import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';

import type { Props as MSWMocksHandlersProps } from '../../../../test-utils/msw-mock-handlers/msw-mock-handlers.types';
import { mockDomainPageQueryParamsValues } from '../../../domain-page/__fixtures__/domain-page-query-params';
import DomainWorkflowsList from '../domain-workflows-list';

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(({ message }: { message: string }) => <div>{message}</div>)
);

jest.mock('@/views/shared/workflows-list/workflows-list', () =>
  jest.fn(() => <div>Mock workflows list</div>)
);

jest.mock('@/hooks/use-page-query-params/use-page-query-params', () =>
  jest.fn(() => [mockDomainPageQueryParamsValues, jest.fn()])
);

jest.mock('query-string', () => ({
  stringifyUrl: jest.fn(
    () => '/api/domains/mock-domain/mock-cluster/workflows'
  ),
}));

describe(DomainWorkflowsList.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders workflows list when data is loaded', async () => {
    setup({});

    expect(await screen.findByText('Mock workflows list')).toBeInTheDocument();
  });

  it('renders loading indicator while fetching', () => {
    setup({ errorCase: 'no-workflows' });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});

function setup({ errorCase }: { errorCase?: 'no-workflows' }) {
  const mockResponse: ListWorkflowsResponse =
    errorCase === 'no-workflows'
      ? { workflows: [], nextPage: '' }
      : {
          workflows: Array.from({ length: 5 }, (_, i) =>
            getMockWorkflowListItem({
              workflowID: `mock-wf-${i}`,
              runID: `mock-run-${i}`,
              workflowName: `mock-name-${i}`,
              status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
              startTime: 1684800000000,
            })
          ),
          nextPage: '',
        };

  render(
    <DomainWorkflowsList
      domain="mock-domain"
      cluster="mock-cluster"
      visibleColumns={[]}
      timeRangeEnd="mock-time-range-end"
    />,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/workflows',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => HttpResponse.json(mockResponse),
        },
      ] as MSWMocksHandlersProps['endpointsMocks'],
    }
  );
}
