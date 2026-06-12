export const DRAFT_ACTION_ID = 'draft';

export const BATCH_ACTION_RPS_DEFAULT = 100;
export const BATCH_ACTIONS_PAGE_SIZE = 10;

// Prefilled query for a new batch action: all running (not-yet-closed)
// workflows on the domain.
export const BATCH_ACTION_DEFAULT_QUERY = 'CloseTime = missing';

export const BATCH_ACTION_TASK_LIST = 'cadence-sys-batcher-tasklist';
export const BATCH_ACTION_EXECUTION_TIMEOUT_SECONDS = 20 * 365 * 24 * 60 * 60;

export const BATCH_ACTION_DETAIL_REFETCH_INTERVAL = 10000;
