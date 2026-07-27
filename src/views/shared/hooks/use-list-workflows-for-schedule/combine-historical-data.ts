import { type InfiniteData } from '@tanstack/react-query';

import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';

/**
 * Appends the workflows still only present in `retainedData` as one trailing
 * page, so the list does not shrink while the re-keyed infinite query refetches
 * its way back to where it was.
 */
export default function combineHistoricalData(
  data: InfiniteData<ListWorkflowsResponse>,
  retainedData: InfiniteData<ListWorkflowsResponse>
): InfiniteData<ListWorkflowsResponse> {
  const seenRunIds = new Set(
    data.pages.flatMap((page) =>
      page.workflows.map((workflow) => workflow.runID)
    )
  );
  const retainedWorkflows = retainedData.pages
    .flatMap((page) => page.workflows)
    .filter((workflow) => {
      if (seenRunIds.has(workflow.runID)) {
        return false;
      }

      seenRunIds.add(workflow.runID);
      return true;
    });

  if (retainedWorkflows.length === 0) {
    return data;
  }

  const lastRetainedPage = retainedData.pages[retainedData.pages.length - 1];

  return {
    pages: [
      ...data.pages,
      {
        workflows: retainedWorkflows,
        nextPage: lastRetainedPage?.nextPage ?? '',
      },
    ],
    pageParams: [...data.pageParams, retainedData.pageParams[0] ?? undefined],
  };
}
