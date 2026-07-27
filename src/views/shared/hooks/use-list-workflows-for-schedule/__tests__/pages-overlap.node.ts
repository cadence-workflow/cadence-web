import { type InfiniteData } from '@tanstack/react-query';

import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';
import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';

import pagesOverlap from '../pages-overlap';

describe(pagesOverlap.name, () => {
  it('is false when either side is missing', () => {
    const data = makeData([['run-1']]);

    expect(pagesOverlap(undefined, data)).toBe(false);
    expect(pagesOverlap(data, undefined)).toBe(false);
  });

  it('is false while the fetched pages are still behind the retained ones', () => {
    expect(pagesOverlap(makeData([['run-1']]), makeData([['run-9']]))).toBe(
      false
    );
  });

  it('is true once any fetched page repeats a retained run', () => {
    expect(
      pagesOverlap(makeData([['run-1'], ['run-9']]), makeData([['run-9']]))
    ).toBe(true);
  });

  it('looks across every retained page, not just the first', () => {
    expect(
      pagesOverlap(makeData([['run-9']]), makeData([['run-1'], ['run-9']]))
    ).toBe(true);
  });
});

function makeData(
  pagesOfRunIds: string[][]
): InfiniteData<ListWorkflowsResponse> {
  return {
    pages: pagesOfRunIds.map((runIds) => ({
      workflows: runIds.map((runID) =>
        getMockWorkflowListItem({ runID, workflowID: `wf-${runID}` })
      ),
      nextPage: '',
    })),
    pageParams: pagesOfRunIds.map((_, index) => `token-${index}`),
  };
}
