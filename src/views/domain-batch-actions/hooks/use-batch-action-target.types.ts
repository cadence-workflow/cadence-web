import type React from 'react';

import { type DomainWorkflow } from '@/views/domain-page/domain-page.types';
import type useCountWorkflows from '@/views/shared/hooks/use-count-workflows';
import type useListWorkflows from '@/views/shared/hooks/use-list-workflows';
import { type SelectionParams } from '@/views/shared/workflows-list/workflows-list.types';

import { type UseBatchActionSelectionResult } from './use-batch-action-selection.types';

export type UseBatchActionTargetParams = {
  domain: string;
  cluster: string;
};

export type BatchActionTargetContext = {
  /** Manual checkbox selection state (only meaningful in select mode). */
  selection: UseBatchActionSelectionResult<string>;
  /** Displayed workflows whose id is currently selected. */
  selectedWorkflows: Array<DomainWorkflow>;
  /** Total size of the matching set, from the count query. */
  totalWorkflowCount: number | undefined;
};

/** The mode-specific values the component renders. */
export type BatchActionTargetOutputs = {
  /** Number of workflows the action will target. */
  selectedCount: number;
  /**
   * True when the target set is empty (query mode: blank query; select mode: no
   * selection). Used to block submission.
   */
  isTargetEmpty: boolean;
  /** Whether the floating-bar action should be disabled. */
  blocksSubmit: boolean;
  /**
   * Builds the visibility query the batch action runs against. Guaranteed
   * non-empty only when `isTargetEmpty` is false.
   */
  getBatchActionQuery: () => string;
  /**
   * Ready-to-render hint shown under the workflows header. Only query mode has
   * one (the empty-query error or the default-query caption); null otherwise.
   */
  queryHint: React.ReactNode;
  /**
   * Per-row + select-all checkbox wiring for WorkflowsList. Undefined in query
   * mode, where the whole query defines the target set.
   */
  listSelection: SelectionParams | undefined;
};

export type BatchActionModeStrategy = {
  /** Visibility query used for both the displayed list and the count. */
  query: string;
  /** Produces the mode-specific outputs from the fetched/selection context. */
  resolve: (context: BatchActionTargetContext) => BatchActionTargetOutputs;
};

export type UseBatchActionTargetResult = {
  /** List query state (workflows + the TanStack infinite-query result). */
  workflowsQueryResult: ReturnType<typeof useListWorkflows>;
  /** Count query state (count + the TanStack query result). */
  countQueryResult: ReturnType<typeof useCountWorkflows>;
  /** Refetches both the list and the count. */
  refetchAll: () => void;
  /** Marks that a submission was attempted (drives the query-mode hint). */
  onSubmitAttempt: () => void;
} & BatchActionTargetOutputs;
