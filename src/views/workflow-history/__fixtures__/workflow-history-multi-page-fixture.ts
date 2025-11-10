import { type GetWorkflowHistoryResponse } from '@/route-handlers/get-workflow-history/get-workflow-history.types';

import {
  scheduleActivityTaskEvent,
  startActivityTaskEvent,
  completeActivityTaskEvent,
} from './workflow-history-activity-events';
import {
  completeDecisionTaskEvent,
  scheduleDecisionTaskEvent,
  startDecisionTaskEvent,
} from './workflow-history-decision-events';

/**
 * Multi-page workflow history fixture for testing pagination
 * Contains 3 pages with various events
 */
const workflowHistoryMultiPageFixture: GetWorkflowHistoryResponse[] = [
  // Page 1: Activity task scheduled and started
  {
    history: { events: [scheduleActivityTaskEvent, startActivityTaskEvent] },
    rawHistory: [],
    archived: false,
    nextPageToken: 'page2',
  },
  // Page 2: Activity completed and decision task scheduled
  {
    history: { events: [completeActivityTaskEvent, scheduleDecisionTaskEvent] },
    rawHistory: [],
    archived: false,
    nextPageToken: 'page3',
  },
  // Page 3: Decision task started and completed (last page)
  {
    history: { events: [startDecisionTaskEvent, completeDecisionTaskEvent] },
    rawHistory: [],
    archived: false,
    nextPageToken: '',
  },
];

export default workflowHistoryMultiPageFixture;
