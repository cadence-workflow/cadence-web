import { HttpResponse } from 'msw';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { type Props as LoaderProps } from '@/components/table/table-infinite-scroll-loader/table-infinite-scroll-loader.types';
import * as usePageQueryParamsModule from '@/hooks/use-page-query-params/use-page-query-params';
import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';
import type { Props as MSWMocksHandlersProps } from '@/test-utils/msw-mock-handlers/msw-mock-handlers.types';
import { mockDomainPageQueryParamsValues } from '@/views/domain-page/__fixtures__/domain-page-query-params';

import DomainWorkflowsBasicTable from '../domain-workflows-basic-table';

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(({ message }: { message: string }) => <div>{message}</div>)
);

jest.mock('../helpers/get-workflows-basic-error-panel-props', () =>
  jest.fn().mockImplementation(({ error }: { error: Error }) => {
    return {
      message: error ? 'Error loading workflows' : 'No workflows found',
    };
  })
);

jest.mock(
  '@/components/table/table-infinite-scroll-loader/table-infinite-scroll-loader',
  () =>
    jest.fn((props: LoaderProps) => (
      <button data-testid="mock-loader" onClick={props.fetchNextPage}>
        Mock end message: {props.error ? 'Error' : 'OK'}
      </button>
    ))
);

jest.mock('query-string', () => ({
  stringifyUrl: jest.fn(
    ({ _, query }) =>
      `/api/domains/mock-domain/mock-cluster/workflows-basic?kind=${query.kind}`
  ),
}));

const mockSetQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () =>
  jest.fn(() => [mockDomainPageQueryParamsValues, mockSetQueryParams])
);

describe(DomainWorkflowsBasicTable.name, () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('renders workflows without error', async () => {
    const { user } = setup({});

    expect(await screen.findByText('Mock end message: OK')).toBeInTheDocument();

    expect(screen.getByText(`mock-workflow-id-0-0-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-1-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-2-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-3-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-4-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-0-closed`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-1-closed`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-2-closed`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-3-closed`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-4-closed`)).toBeInTheDocument();

    await user.click(screen.getByTestId('mock-loader'));

    expect(await screen.findByText('Mock end message: OK')).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-5-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-6-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-7-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-8-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-9-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-5-closed`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-6-closed`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-7-closed`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-8-closed`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-9-closed`)).toBeInTheDocument();
  });

  it('renders error panel if the initial call fails', async () => {
    setup({ errorCase: 'initial-fetch-error' });

    expect(
      await screen.findByText('Error loading workflows')
    ).toBeInTheDocument();
  });

  it('renders error panel in search mode if no workflows are found', async () => {
    setup({ errorCase: 'no-workflows' });

    expect(await screen.findByText('No workflows found')).toBeInTheDocument();
  });

  it('renders workflows and allows the user to try again if there is an error', async () => {
    const { user } = setup({ errorCase: 'subsequent-fetch-error' });

    expect(await screen.findByText('Mock end message: OK')).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-0-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-1-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-2-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-3-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-4-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-0-closed`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-1-closed`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-2-closed`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-3-closed`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-4-closed`)).toBeInTheDocument();

    await user.click(screen.getByTestId('mock-loader'));

    expect(
      await screen.findByText('Mock end message: Error')
    ).toBeInTheDocument();

    await user.click(screen.getByTestId('mock-loader'));

    expect(await screen.findByText('Mock end message: OK')).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-5-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-6-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-7-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-8-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-9-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-5-closed`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-6-closed`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-7-closed`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-8-closed`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-9-closed`)).toBeInTheDocument();
  });

  it('calls only listOpen if Running status is selected', async () => {
    jest.spyOn(usePageQueryParamsModule, 'default').mockReturnValue([
      {
        ...mockDomainPageQueryParamsValues,
        statusBasic: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
      },
      mockSetQueryParams,
    ]);

    setup({});

    expect(await screen.findByText('Mock end message: OK')).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-0-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-1-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-2-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-3-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-4-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-5-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-6-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-7-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-8-open`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-9-open`)).toBeInTheDocument();
  });

  it('calls only listClosed if a close status is selected', async () => {
    jest.spyOn(usePageQueryParamsModule, 'default').mockReturnValue([
      {
        ...mockDomainPageQueryParamsValues,
        statusBasic: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
      },
      mockSetQueryParams,
    ]);

    setup({});

    expect(await screen.findByText('Mock end message: OK')).toBeInTheDocument();

    expect(screen.getByText(`mock-workflow-id-0-0-closed`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-1-closed`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-2-closed`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-3-closed`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-4-closed`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-5-closed`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-6-closed`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-7-closed`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-8-closed`)).toBeInTheDocument();
    expect(screen.getByText(`mock-workflow-id-0-9-closed`)).toBeInTheDocument();
  });
});

function setup({
  errorCase,
}: {
  errorCase?: 'initial-fetch-error' | 'subsequent-fetch-error' | 'no-workflows';
}) {
  const openPages = generateWorkflowPages(2, true);
  const closedPages = generateWorkflowPages(2);

  let currentEventIndexOpen = 0;
  let currentEventIndexClosed = 0;
  const user = userEvent.setup();

  const renderResult = render(
    <DomainWorkflowsBasicTable domain="mock-domain" cluster="mock-cluster" />,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/workflows-basic',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async ({ request }) => {
            const url = new URL(request.url);
            const kind = url.searchParams.get('kind');

            let index;
            if (kind === 'closed') {
              index = currentEventIndexClosed;
              currentEventIndexClosed++;
            } else {
              index = currentEventIndexOpen;
              currentEventIndexOpen++;
            }

            const pages = kind === 'closed' ? closedPages : openPages;

            switch (errorCase) {
              case 'no-workflows':
                return HttpResponse.json({
                  workflows: [],
                  nextPage: undefined,
                });
              case 'initial-fetch-error':
                return HttpResponse.json(
                  { message: 'Request failed' },
                  { status: 500 }
                );
              case 'subsequent-fetch-error':
                if (index === 0) {
                  return HttpResponse.json(pages[0]);
                } else if (index === 1) {
                  return HttpResponse.json(
                    { message: 'Request failed' },
                    { status: 500 }
                  );
                } else {
                  return HttpResponse.json(pages[1]);
                }
              default:
                if (index === 0) {
                  return HttpResponse.json(pages[0]);
                } else {
                  return HttpResponse.json(pages[1]);
                }
            }
          },
        },
      ] as MSWMocksHandlersProps['endpointsMocks'],
    }
  );

  return { user, ...renderResult };
}

// TODO @adhitya.mamallan - Explore using fakerjs.dev for cases like this
function generateWorkflowPages(
  count: number,
  isOpen?: boolean
): Array<ListWorkflowsResponse> {
  const pages = Array.from(
    { length: count },
    (_, pageIndex): ListWorkflowsResponse => ({
      workflows: Array.from({ length: 10 }, (_, index) => ({
        workflowID: `mock-workflow-id-${pageIndex}-${index}-${isOpen ? 'open' : 'closed'}`,
        runID: `mock-run-id-${pageIndex}-${index}`,
        workflowName: `mock-workflow-name-${pageIndex}-${index}`,
        status: isOpen
          ? 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID'
          : 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
        startTime: 1684800000000 - pageIndex * 1000 - index * 100,
        closeTime: isOpen ? undefined : 1684886400000,
      })),
      nextPage: `${pageIndex + 1}`,
    })
  );

  pages[pages.length - 1].nextPage = '';
  return pages;
}
