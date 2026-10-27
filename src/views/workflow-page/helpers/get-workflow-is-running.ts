import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

import getWorkflowIsCompleted from './get-workflow-is-completed';

export default function getWorkflowIsRunning(
  closeEvent: HistoryEvent | null
): boolean {
  return (
    !closeEvent ||
    !closeEvent.attributes ||
    !getWorkflowIsCompleted(closeEvent.attributes)
  );
}
