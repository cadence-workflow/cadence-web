import parseErrorMessageForQueryTypes from '@/route-handlers/fetch-workflow-query-types/helpers/parse-error-message-for-query-types';
import { type QueryWorkflowResponse } from '@/route-handlers/query-workflow/query-workflow.types';
import { type RequestError } from '@/utils/request/request-error';

import { WORKFLOW_HOME_QUERY_NAME } from '../workflow-home.constants';
import { type WorkflowHomeState } from '../workflow-home.types';

import getHomePage from './get-home-page';

export default function getWorkflowHomeContent({
  isEnabled,
  isArchived,
  homeQuery,
}: {
  isEnabled: boolean;
  isArchived: boolean;
  homeQuery: {
    data?: QueryWorkflowResponse;
    error?: RequestError | null;
    isLoading?: boolean;
  };
}): WorkflowHomeState {
  if (!isEnabled) {
    return { state: 'disabled' };
  }

  if (isArchived) {
    return { state: 'archived' };
  }

  // A failed background refetch keeps showing the last good page
  if (homeQuery.error && !homeQuery.data) {
    // A workflow without the query handler lists its known query types in the error
    if (parseErrorMessageForQueryTypes(homeQuery.error.message)) {
      return { state: 'not-set-up' };
    }
    return { state: 'error', description: homeQuery.error.message };
  }

  if (homeQuery.isLoading || !homeQuery.data) {
    return { state: 'loading' };
  }

  const { data } = homeQuery;

  if (data.rejected) {
    return {
      state: 'error',
      description: `The workflow is closed with status ${data.rejected.closeStatus}`,
    };
  }

  const homePage = getHomePage(data.result);
  if (homePage) {
    return { state: 'ready', content: homePage.content, title: homePage.title };
  }

  return {
    state: 'invalid-format',
    description: `The "${WORKFLOW_HOME_QUERY_NAME}" query must return a formattedData result with the format "text/markdown".`,
  };
}
