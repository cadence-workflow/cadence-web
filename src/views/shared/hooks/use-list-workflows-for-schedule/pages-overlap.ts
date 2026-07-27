import { type InfiniteData } from '@tanstack/react-query';

import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';

/**
 * True when the freshly fetched pages have caught up with the retained ones,
 * which is how we know the retained data can be dropped.
 */
export default function pagesOverlap(
  data: InfiniteData<ListWorkflowsResponse> | undefined,
  retainedData: InfiniteData<ListWorkflowsResponse> | undefined
): boolean {
  if (!data || !retainedData) {
    return false;
  }

  const retainedRunIds = new Set(
    retainedData.pages.flatMap((page) =>
      page.workflows.map((workflow) => workflow.runID)
    )
  );

  return data.pages.some((page) =>
    page.workflows.some((workflow) => retainedRunIds.has(workflow.runID))
  );
}
