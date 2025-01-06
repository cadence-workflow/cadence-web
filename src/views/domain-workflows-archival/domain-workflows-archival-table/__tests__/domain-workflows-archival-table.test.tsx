import { HttpResponse } from 'msw';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { type Props as LoaderProps } from '@/components/table/table-infinite-scroll-loader/table-infinite-scroll-loader.types';
import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';
import { type WorkflowsHeaderInputType } from '@/views/shared/workflows-header/workflows-header.types';

import type { Props as MSWMocksHandlersProps } from '../../../../test-utils/msw-mock-handlers/msw-mock-handlers.types';
import { mockDomainPageQueryParamsValues } from '../../../domain-page/__fixtures__/domain-page-query-params';
import DomainWorkflowsArchivalTable from '../domain-workflows-archival-table';

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(({ message }: { message: string }) => <div>{message}</div>)
);

jest.mock('../helpers/get-archival-error-panel-props', () =>
  jest
    .fn()
    .mockImplementation(
      ({
        error,
        inputType,
      }: {
        error: Error;
        inputType: WorkflowsHeaderInputType;
      }) => {
        if (inputType === 'query') {
          return {
            message: error ? error.message : undefined,
          };
        }
        return {
          message: error ? 'Error loading workflows' : 'No workflows found',
        };
      }
    )
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
    () => '/api/domains/mock-domain/mock-cluster/workflows'
  ),
}));

const mockSetQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () =>
  jest.fn(() => [mockDomainPageQueryParamsValues, mockSetQueryParams])
);

describe(DomainWorkflowsArchivalTable.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders workflows without error', async () => {
    const { user } = setup({});

    expect(await screen.findByText('Mock end message: OK')).toBeInTheDocument();
    Array(10).forEach((_, index) => {
      expect(
        screen.getByText(`mock-workflow-id-0-${index}`)
      ).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('mock-loader'));

    expect(await screen.findByText('Mock end message: OK')).toBeInTheDocument();
    Array(10).forEach((_, index) => {
      expect(
        screen.getByText(`mock-workflow-id-1-${index}`)
      ).toBeInTheDocument();
    });
  });

  it('renders error panel if the initial call fails', async () => {
    setup({ errorCase: 'initial-fetch-error' });

    expect(
      await screen.findByText('Error loading workflows')
    ).toBeInTheDocument();
  });

  it('renders workflows and allows the user to try again if there is an error', async () => {
    const { user } = setup({ errorCase: 'subsequent-fetch-error' });

    expect(await screen.findByText('Mock end message: OK')).toBeInTheDocument();
    Array(10).forEach((_, index) => {
      expect(
        screen.getByText(`mock-workflow-id-0-${index}`)
      ).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('mock-loader'));

    expect(
      await screen.findByText('Mock end message: Error')
    ).toBeInTheDocument();

    await user.click(screen.getByTestId('mock-loader'));

    expect(await screen.findByText('Mock end message: OK')).toBeInTheDocument();
    Array(10).forEach((_, index) => {
      expect(
        screen.getByText(`mock-workflow-id-1-${index}`)
      ).toBeInTheDocument();
    });
  });
});

function setup({
  errorCase,
}: {
  errorCase?: 'initial-fetch-error' | 'subsequent-fetch-error';
}) {
  const pages = generateWorkflowPages(2);
  let currentEventIndex = 0;
  const user = userEvent.setup();

  render(
    <DomainWorkflowsArchivalTable
      domain="mock-domain"
      cluster="mock-cluster"
    />,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/workflows',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => {
            const index = currentEventIndex;
            currentEventIndex++;

            switch (errorCase) {
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

  return { user };
}

// TODO @adhitya.mamallan - Explore using fakerjs.dev for cases like this
function generateWorkflowPages(count: number): Array<ListWorkflowsResponse> {
  const pages = Array.from(
    { length: count },
    (_, pageIndex): ListWorkflowsResponse => ({
      workflows: Array.from({ length: 10 }, (_, index) => ({
        workflowID: `mock-workflow-id-${pageIndex}-${index}`,
        runID: `mock-run-id-${pageIndex}-${index}`,
        workflowName: `mock-workflow-name-${pageIndex}-${index}`,
        status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
        startTime: 1684800000000,
        closeTime: count > 5 ? 1684886400000 : undefined,
      })),
      nextPage: `${pageIndex + 1}`,
    })
  );

  pages[pages.length - 1].nextPage = '';
  return pages;
}
