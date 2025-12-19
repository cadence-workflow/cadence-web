import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import {
  type RouteParams as GetWorkflowHistoryRouteParams,
  type WorkflowHistoryQueryParams,
} from '@/route-handlers/get-workflow-history/get-workflow-history.types';

export type UseWorkflowHistoryFetcherParams = WorkflowHistoryQueryParams &
  GetWorkflowHistoryRouteParams;

export type UseWorkflowHistoryFetcherOptions = {
  onEventsChange: (events: HistoryEvent[]) => void;
  fetchThrottleMs?: number;
  renderThrottleMs?: number;
};
