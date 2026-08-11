import formatWorkflowHistoryEvent from '@/utils/data-formatters/format-workflow-history-event';
import { startWorkflowExecutionEvent } from '@/views/workflow-history/__fixtures__/workflow-history-single-events';

import { type FormattedFirstHistoryEvent } from '../workflow-summary-details/workflow-summary-details.types';

export const mockFormattedFirstEvent = formatWorkflowHistoryEvent(
  startWorkflowExecutionEvent
) as FormattedFirstHistoryEvent;
