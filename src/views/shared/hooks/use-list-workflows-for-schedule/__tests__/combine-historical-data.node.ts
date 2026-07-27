import { type InfiniteData } from '@tanstack/react-query';

import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';
import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';

import combineHistoricalData from '../combine-historical-data';

describe(combineHistoricalData.name, () => {
  it('appends retained workflows the fetched pages have not reached yet', () => {
    const fetched = makeData([['run-1', 'run-2']], ['token-1']);
    const retained = makeData([['run-3', 'run-4']], ['token-2'], 'token-3');

    const combined = combineHistoricalData(fetched, retained);

    expect(combined.pages).toHaveLength(2);
    expect(runIdsOf(combined)).toEqual(['run-1', 'run-2', 'run-3', 'run-4']);
    expect(combined.pages[1].nextPage).toBe('token-3');
    expect(combined.pageParams).toEqual(['token-1', 'token-2']);
  });

  it('drops retained workflows that the fetched pages already cover', () => {
    const fetched = makeData([['run-1', 'run-2']], ['token-1']);
    const retained = makeData([['run-2', 'run-3']], ['token-2']);

    expect(runIdsOf(combineHistoricalData(fetched, retained))).toEqual([
      'run-1',
      'run-2',
      'run-3',
    ]);
  });

  it('deduplicates workflows repeated across retained pages', () => {
    const fetched = makeData([['run-1']], ['token-1']);
    const retained = makeData([['run-2'], ['run-2', 'run-3']], ['token-2']);

    expect(runIdsOf(combineHistoricalData(fetched, retained))).toEqual([
      'run-1',
      'run-2',
      'run-3',
    ]);
  });

  it('returns the fetched data untouched once it covers everything retained', () => {
    const fetched = makeData([['run-1', 'run-2']], ['token-1']);
    const retained = makeData([['run-1']], ['token-2']);

    expect(combineHistoricalData(fetched, retained)).toBe(fetched);
  });
});

function makeData(
  pagesOfRunIds: string[][],
  pageParams: Array<string | undefined>,
  lastNextPage = ''
): InfiniteData<ListWorkflowsResponse> {
  return {
    pages: pagesOfRunIds.map((runIds, index) => ({
      workflows: runIds.map((runID) =>
        getMockWorkflowListItem({ runID, workflowID: `wf-${runID}` })
      ),
      nextPage: index === pagesOfRunIds.length - 1 ? lastNextPage : 'more',
    })),
    pageParams,
  };
}

function runIdsOf(data: InfiniteData<ListWorkflowsResponse>) {
  return data.pages.flatMap((page) =>
    page.workflows.map((workflow) => workflow.runID)
  );
}
