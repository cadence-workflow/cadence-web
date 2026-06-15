import type React from 'react';

import { type RequestError } from '@/utils/request/request-error';
import { type DomainWorkflow } from '@/views/domain-page/domain-page.types';
import { type SelectionParams } from '@/views/shared/workflows-list/workflows-list.types';

export type UseBatchActionTargetParams = {
  domain: string;
  cluster: string;
};

export type UseBatchActionTargetResult = {
  /** Workflows in the displayed list (the matching set, paginated). */
  workflows: Array<DomainWorkflow>;
  /** Error from the list query, if any. */
  error: RequestError | null;
  /** True while the first page of the list is loading. */
  isLoading: boolean;
  /** True while the list is fetching (including background refetches). */
  isFetching: boolean;
  /** True when more pages of the list are available. */
  hasNextPage: boolean;
  /** Fetches the next page of the list. */
  fetchNextPage: () => void;
  /** True while the next page is being fetched. */
  isFetchingNextPage: boolean;
  /** Total number of workflows in the matching set, from the count query. */
  totalWorkflowCount: number | undefined;
  /** Error from the count query, if any. */
  countError: RequestError | null;
  /** True while the count is loading. */
  isCountLoading: boolean;
  /** Refetches both the list and the count. */
  refetchAll: () => void;
  /** Number of workflows the action will target. */
  selectedCount: number;
  /**
   * True when the target set is empty (query mode: blank query; select mode: no
   * selection). Used to block submission.
   */
  isTargetEmpty: boolean;
  /**
   * Whether the floating-bar action should be disabled. Captures the
   */
  blocksSubmit: boolean;
  /**
   * Builds the visibility query the batch action runs against. Guaranteed
   * non-empty only when `isTargetEmpty` is false.
   */
  getBatchActionQuery: () => string;
  /** Marks that a submission was attempted (drives the query-mode hint). */
  onSubmitAttempt: () => void;
  /**
   * Ready-to-render hint shown under the workflows header in query mode
   */
  queryHint: React.ReactNode;
  /**
   * Per-row + select-all checkbox wiring for WorkflowsList. Undefined in query
   * mode, where the whole query defines the target set.
   */
  listSelection: SelectionParams | undefined;
};
