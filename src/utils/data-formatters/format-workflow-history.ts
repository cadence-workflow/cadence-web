import { type GetWorkflowHistoryResponse } from '@/route-handlers/get-workflow-history/get-workflow-history.types';

import formatWorkflowHistoryEvent from './format-workflow-history-event';

const formatWorkflowHistory = ({
  archived,
  history,
  rawHistory,
  ...response
}: GetWorkflowHistoryResponse) => ({
  ...response,
  archived: archived || null,
  history: {
    events: (history?.events || []).map(formatWorkflowHistoryEvent),
  },
  rawHistory: rawHistory?.length ? rawHistory : null,
});

export default formatWorkflowHistory;
