import { type QueryWorkflowResponse } from '@/route-handlers/query-workflow/query-workflow.types';

import getHomePage from './get-home-page';

export default function getHomeBadge(
  data: QueryWorkflowResponse | undefined
): string | undefined {
  if (!data || data.rejected) return undefined;
  return getHomePage(data.result)?.badgeName;
}
