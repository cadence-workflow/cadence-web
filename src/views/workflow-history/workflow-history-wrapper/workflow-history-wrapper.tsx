import useIsWorkflowHistoryV2Enabled from '@/views/workflow-history-v2/hooks/use-is-workflow-history-v2-enabled';
import WorkflowHistoryV2 from '@/views/workflow-history-v2/workflow-history-v2';

import WorkflowHistory from '../workflow-history';
import WorkflowHistoryContextProvider from '../workflow-history-context-provider/workflow-history-context-provider';
import { type Props } from '../workflow-history.types';

export default function WorkflowHistoryWrapper(props: Props) {
  const isWorkflowHistoryV2Enabled = useIsWorkflowHistoryV2Enabled();

  return (
    <WorkflowHistoryContextProvider>
      {isWorkflowHistoryV2Enabled ? (
        <WorkflowHistoryV2 {...props} />
      ) : (
        <WorkflowHistory {...props} />
      )}
    </WorkflowHistoryContextProvider>
  );
}
