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
  empty: 'This workflow has no home page.',
} as const;

export const WORKFLOW_HOME_EMPTY_DESCRIPTION =
  'The worker code of a workflow defines this page with a query that returns a home page result.';

export const WORKFLOW_HOME_GO_SNIPPET = `workflow.SetQueryHandler(ctx, "${WORKFLOW_HOME_QUERY_NAME}", func() (map[string]interface{}, error) {
    return map[string]interface{}{
        "cadenceResponseType": "formattedData",
        "format":              "text/markdown",
        "data":                "## Hello from my workflow",
        "title":               "My workflow",
    }, nil
})`;
