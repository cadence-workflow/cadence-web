import { Suspense } from 'react';

import { render, screen, act, fireEvent } from '@/test-utils/rtl';

import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';
import * as requestModule from '@/utils/request';

import { mockDomainWorkflowsQueryParamsValues } from '../../__fixtures__/domain-workflows-query-params';
import { type Props as EndMessageProps } from '../../domain-workflows-table-end-message/domain-workflows-table-end-message.types';
import DomainWorkflowsTable from '../domain-workflows-table';

jest.mock(
  '../../domain-workflows-table-end-message/domain-workflows-table-end-message',
  () =>
    jest.fn((props: EndMessageProps) => (
      <button data-testid="mock-end-message" onClick={props.fetchNextPage}>
        Mock end message: {props.error ? 'Error' : 'OK'}
      </button>
    ))
);

jest.mock('query-string', () => ({
  stringifyUrl: jest.fn(() => 'mock-stringified-api-url'),
}));

jest.mock('@/utils/request');

const mockSetQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () =>
  jest.fn(() => [mockDomainWorkflowsQueryParamsValues, mockSetQueryParams])
);

describe(DomainWorkflowsTable.name, () => {
  it('renders workflows without error', async () => {
    await setup({});

    expect(await screen.findByText('Mock end message: OK')).toBeInTheDocument();
    Array(10).forEach((_, index) => {
      expect(
        screen.getByText(`mock-workflow-id-0-${index}`)
      ).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('mock-end-message'));
    });

    expect(await screen.findByText('Mock end message: OK')).toBeInTheDocument();
    Array(10).forEach((_, index) => {
      expect(
        screen.getByText(`mock-workflow-id-1-${index}`)
      ).toBeInTheDocument();
    });
  });

  it('does not render if the initial call fails', async () => {
    let renderErrorMessage;
    try {
      await act(async () => {
        await setup({ errorCase: 'initial-fetch-error' });
      });
    } catch (error) {
      if (error instanceof Error) {
        renderErrorMessage = error.message;
      }
    }

    expect(renderErrorMessage).toEqual('Request failed');
  });

  it('renders workflows and allows the user to try again if there is an error', async () => {
    await setup({ errorCase: 'subsequent-fetch-error' });

    expect(await screen.findByText('Mock end message: OK')).toBeInTheDocument();
    Array(10).forEach((_, index) => {
      expect(
        screen.getByText(`mock-workflow-id-0-${index}`)
      ).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('mock-end-message'));
    });

    expect(
      await screen.findByText('Mock end message: Error')
    ).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByTestId('mock-end-message'));
    });

    expect(await screen.findByText('Mock end message: OK')).toBeInTheDocument();
    Array(10).forEach((_, index) => {
      expect(
        screen.getByText(`mock-workflow-id-1-${index}`)
      ).toBeInTheDocument();
    });
  });
});

async function setup({
  errorCase,
}: {
  errorCase?: 'initial-fetch-error' | 'subsequent-fetch-error';
}) {
  // TODO: @adhitya.mamallan - This is not type-safe, explore using a library such as nock or msw
  const requestMock = jest.spyOn(requestModule, 'default') as jest.Mock;
  const pages = generateWorkflowPages(2);

  if (errorCase === 'subsequent-fetch-error') {
    requestMock
      .mockResolvedValueOnce({
        json: () => Promise.resolve(pages[0]),
      })
      .mockRejectedValueOnce(new Error('Request failed'))
      .mockResolvedValueOnce({
        json: () => Promise.resolve(pages[1]),
      });
  } else if (errorCase === 'initial-fetch-error') {
    requestMock.mockRejectedValueOnce(new Error('Request failed'));
  } else {
    requestMock
      .mockResolvedValueOnce({
        json: () => Promise.resolve(pages[0]),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(pages[1]),
      });
  }

  render(
    <Suspense>
      <DomainWorkflowsTable domain="mock-domain" cluster="mock-cluster" />
    </Suspense>
  );
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
