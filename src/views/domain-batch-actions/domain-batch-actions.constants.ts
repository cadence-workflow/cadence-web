import { type PageQueryParamSetterValues } from '@/hooks/use-page-query-params/use-page-query-params.types';
import { domainBatchActionsQueryParamsConfig } from '@/views/domain-page/config/domain-page-query-params.config';

export const DRAFT_ACTION_ID = 'draft';

// Derived from the batch query params config
// so a new batch param is reset automatically. Discarding or starting a new
// draft applies this, preventing stale "Select"/"Query" mode state from
// leaking across drafts.
export const BATCH_DRAFT_RESET_PARAMS = Object.fromEntries(
  domainBatchActionsQueryParamsConfig.map((param) => [param.key, undefined])
) as Partial<
  PageQueryParamSetterValues<typeof domainBatchActionsQueryParamsConfig>
>;

export const BATCH_ACTION_RPS_DEFAULT = 100;
export const BATCH_ACTIONS_PAGE_SIZE = 10;

// Prefilled query for a new batch action: all running (not-yet-closed)
// workflows on the domain.
export const BATCH_ACTION_DEFAULT_QUERY = 'CloseTime = missing';

// Hints shown under the workflows header in query mode.
export const BATCH_ACTION_EMPTY_QUERY_ERROR = 'Query must not be empty';
export const BATCH_ACTION_DEFAULT_QUERY_HINT =
  'Showing all running workflows. Edit the query to narrow the set.';

export const BATCH_ACTION_TASK_LIST = 'cadence-sys-batcher-tasklist';
export const BATCH_ACTION_EXECUTION_TIMEOUT_SECONDS = 20 * 365 * 24 * 60 * 60;

// Signal sent to a running batcher workflow to adjust its RPS on the fly.
export const BATCH_ACTION_TUNE_SIGNAL_NAME = 'cadence-sys-batch-tune-signal';

export const BATCH_ACTION_DETAIL_REFETCH_INTERVAL = 5000;

// Poll interval for the sidebar list so newly started / status-changed actions
// show up without a manual refresh.
export const BATCH_ACTIONS_LIST_REFETCH_INTERVAL = 10000;

// Delay before refreshing the list after starting a batch action, to allow the
// new batcher workflow to become visible (visibility propagation lag).
export const BATCH_ACTION_LIST_INVALIDATE_TIMEOUT_MS = 2000;

// Tooltip shown on a disabled per-row checkbox while "select all" is active.
export const BATCH_ACTION_SELECT_ALL_ROW_TOOLTIP =
  'Turn off "Select all" to choose workflows individually.';
