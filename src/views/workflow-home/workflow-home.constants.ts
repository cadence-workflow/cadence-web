// Contract with workers: the query handler a workflow registers to provide its home page.
export const WORKFLOW_HOME_QUERY_NAME = 'home';

export const WORKFLOW_HOME_ACTION_REFETCH_DELAY_MS = 1000;

export const WORKFLOW_HOME_REFRESH_INTERVAL_MS = 10000;

export const WORKFLOW_HOME_QUERY_MAX_RETRIES = 3;

export const WORKFLOW_HOME_QUERY_RETRY_DELAY_MS = 4000;

export const WORKFLOW_HOME_MESSAGES = {
  disabled: 'Home pages are not enabled',
  archived: 'Home pages are not available for archived workflows',
  error: 'Could not load the home page',
  invalidFormat: 'The home page is not in a supported format',
  empty: 'This workflow has no home page',
} as const;

export const WORKFLOW_HOME_EMPTY_DESCRIPTION =
  'To set one up, follow the guide below to add a home page query handler to your worker code.';
