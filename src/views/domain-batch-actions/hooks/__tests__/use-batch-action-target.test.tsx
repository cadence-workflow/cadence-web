import { HttpResponse } from 'msw';

import { act, render, renderHook, screen, waitFor } from '@/test-utils/rtl';

import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';
import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';
import { mockDomainPageQueryParamsValues } from '@/views/domain-page/__fixtures__/domain-page-query-params';
import { type CountWorkflowsResponse } from '@/views/shared/hooks/use-count-workflows.types';

import { type Props as MSWMocksHandlersProps } from '../../../../test-utils/msw-mock-handlers/msw-mock-handlers.types';
import { BATCH_ACTION_DEFAULT_QUERY } from '../../domain-batch-actions.constants';
import useBatchActionTarget from '../use-batch-action-target';

const mockUsePageQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () => ({
  __esModule: true,
  default: (...args: Array<unknown>) => mockUsePageQueryParams(...args),
}));

describe(useBatchActionTarget.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setQueryParams({ batchQuery: 'WorkflowType="foo"' });
  });

  it('uses the count as the selected count in query mode', async () => {
    const { result } = setup({ totalCount: 7 });

    await waitFor(() => expect(result.current.countQueryResult.count).toBe(7));
    expect(result.current.selectedCount).toBe(7);
    expect(result.current.listSelection).toBeUndefined();
  });

  it('exposes the raw query as the batch action query in query mode', async () => {
    const { result } = setup({ totalCount: 7 });

    await waitFor(() => expect(result.current.countQueryResult.count).toBe(7));
    expect(result.current.getBatchActionQuery()).toBe('WorkflowType="foo"');
  });

  it('renders the default-query caption as the query hint', async () => {
    setQueryParams({ batchQuery: BATCH_ACTION_DEFAULT_QUERY });
    const { result } = setup({});

    await waitFor(() =>
      expect(result.current.countQueryResult.count).toBe(100)
    );
    render(<>{result.current.queryHint}</>);
    expect(
      screen.getByText(/Showing all running workflows/i)
    ).toBeInTheDocument();
  });

  it('has no query hint once the query has been edited', async () => {
    setQueryParams({ batchQuery: 'WorkflowType="foo"' });
    const { result } = setup({});

    await waitFor(() =>
      expect(result.current.countQueryResult.count).toBe(100)
    );
    expect(result.current.queryHint).toBeNull();
  });

  it('only blocks submission and shows the error hint after a submit attempt', async () => {
    setQueryParams({ batchQuery: '' });
    const { result } = setup({});

    await waitFor(() =>
      expect(result.current.countQueryResult.count).toBe(100)
    );
    expect(result.current.isTargetEmpty).toBe(true);
    expect(result.current.blocksSubmit).toBe(false);
    expect(result.current.queryHint).toBeNull();

    act(() => result.current.onSubmitAttempt());

    expect(result.current.blocksSubmit).toBe(true);
    render(<>{result.current.queryHint}</>);
    expect(screen.getByText('Query must not be empty')).toBeInTheDocument();
  });

  describe('select mode', () => {
    beforeEach(() => {
      setQueryParams({ batchInputType: 'search' });
    });

    it('starts with nothing selected and blocks submission immediately', async () => {
      const { result } = setup({ workflowCount: 2, totalCount: 5 });

      await waitFor(() =>
        expect(result.current.countQueryResult.count).toBe(5)
      );
      expect(result.current.listSelection).toBeDefined();
      expect(result.current.queryHint).toBeNull();
      expect(result.current.selectedCount).toBe(0);
      expect(result.current.isTargetEmpty).toBe(true);
      expect(result.current.blocksSubmit).toBe(true);
    });

    it('builds a selection query from individually toggled workflows', async () => {
      const { result } = setup({ workflowCount: 2, totalCount: 5 });

      await waitFor(() =>
        expect(result.current.workflowsQueryResult.workflows).toHaveLength(2)
      );
      act(() => {
        result.current.listSelection?.onToggle(
          result.current.workflowsQueryResult.workflows[0]
        );
      });

      expect(result.current.selectedCount).toBe(1);
      expect(result.current.blocksSubmit).toBe(false);
      expect(result.current.getBatchActionQuery()).toBe('(RunID = "run-0")');
    });

    it('builds the matching-set query when select all is active', async () => {
      setQueryParams({
        batchInputType: 'search',
        batchSearch: 'foo',
        batchTimeRangeEnd: undefined,
      });
      const { result } = setup({ workflowCount: 2, totalCount: 5 });

      await waitFor(() =>
        expect(result.current.countQueryResult.count).toBe(5)
      );
      act(() => {
        result.current.listSelection?.onToggleAll();
      });

      expect(result.current.selectedCount).toBe(5);
      expect(result.current.getBatchActionQuery()).toBe(
        '(WorkflowType = "foo" OR WorkflowID = "foo" OR RunID = "foo")'
      );
    });

    it('resets the selection when the search filter changes', async () => {
      const { result, rerender } = setup({ workflowCount: 2, totalCount: 5 });

      await waitFor(() =>
        expect(result.current.workflowsQueryResult.workflows).toHaveLength(2)
      );
      act(() => {
        result.current.listSelection?.onToggle(
          result.current.workflowsQueryResult.workflows[0]
        );
      });
      expect(result.current.selectedCount).toBe(1);

      setQueryParams({ batchInputType: 'search', batchSearch: 'bar' });
      rerender();

      await waitFor(() => expect(result.current.selectedCount).toBe(0));
    });
  });
});

function setQueryParams(overrides: Record<string, unknown>) {
  mockUsePageQueryParams.mockReturnValue([
    { ...mockDomainPageQueryParamsValues, ...overrides },
    jest.fn(),
  ]);
}

function setup({
  workflowCount = 1,
  totalCount = 100,
}: {
  workflowCount?: number;
  totalCount?: number;
} = {}) {
  const response: ListWorkflowsResponse = {
    workflows: Array.from({ length: workflowCount }, (_, i) =>
      getMockWorkflowListItem({ workflowID: `wf-${i}`, runID: `run-${i}` })
    ),
    nextPage: '',
  };
  const countResponse: CountWorkflowsResponse = { count: totalCount };

  return renderHook(
    () =>
      useBatchActionTarget({ domain: 'test-domain', cluster: 'test-cluster' }),
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/workflows',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => HttpResponse.json(response),
        },
        {
          path: '/api/domains/:domain/:cluster/workflows/count',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => HttpResponse.json(countResponse),
        },
      ] as MSWMocksHandlersProps['endpointsMocks'],
    }
  );
}
